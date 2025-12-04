const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Product = require('../models/Product');
const Message = require('../models/Message');
const Contact = require('../models/Contact');
const cloudinary = require('cloudinary').v2;

// Check if user is admin
router.get('/admin/check', adminAuth, async (req, res) => {
  try {
    res.json({ isAdmin: true, email: req.user.userEmail });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics - OPTIMIZED with parallel queries
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Run all independent queries in parallel for better performance
    const [
      totalUsers,
      totalProducts,
      totalMessages,
      totalContacts,
      newContacts,
      verifiedUsers,
      newUsersThisMonth,
      newProductsThisMonth,
      productsByCategory,
      productsPerDay,
      usersPerDay,
      topSellers,
      priceStats,
      recentProducts,
      recentUsers,
      recentContacts
    ] = await Promise.all([
      // Count queries
      User.countDocuments(),
      Product.countDocuments(),
      Message.countDocuments(),
      Contact.countDocuments(),
      Contact.countDocuments({ status: 'new' }),
      User.countDocuments({ isEmailVerified: true }),
      User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      Product.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
      
      // Aggregation queries
      Product.aggregate([
        { $group: { _id: '$catagory', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]),
      
      Product.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      User.aggregate([
        { $match: { createdAt: { $gte: sevenDaysAgo } } },
        { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
        { $sort: { _id: 1 } }
      ]),
      
      Product.aggregate([
        { $group: { _id: '$useremail', productCount: { $sum: 1 }, owner: { $first: '$owner' } } },
        { $sort: { productCount: -1 } },
        { $limit: 5 }
      ]),
      
      Product.aggregate([
        { $addFields: { numericPrice: { $toDouble: '$price' } } },
        { $group: { _id: null, avgPrice: { $avg: '$numericPrice' }, maxPrice: { $max: '$numericPrice' }, minPrice: { $min: '$numericPrice' }, totalValue: { $sum: '$numericPrice' } } }
      ]),
      
      // Recent data queries with lean() for better performance
      Product.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title price owner catagory createdAt useremail')
        .lean(),
      
      User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email isEmailVerified createdAt picture')
        .lean(),
      
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email subject status createdAt')
        .lean()
    ]);

    res.json({
      overview: {
        totalUsers,
        totalProducts,
        totalMessages,
        totalContacts,
        newContacts,
        verifiedUsers,
        newUsersThisMonth,
        newProductsThisMonth,
        verificationRate: totalUsers > 0 ? ((verifiedUsers / totalUsers) * 100).toFixed(1) : 0
      },
      productsByCategory,
      productsPerDay,
      usersPerDay,
      topSellers,
      priceStats: priceStats[0] || { avgPrice: 0, maxPrice: 0, minPrice: 0, totalValue: 0 },
      recentProducts,
      recentUsers,
      recentContacts
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ message: 'Failed to fetch statistics' });
  }
});

// Get all users with pagination
router.get('/admin/users', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    const query = search
      ? {
          $or: [
            { email: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } }
          ]
        }
      : {};

    // Run users query and count in parallel
    const [users, total] = await Promise.all([
      User.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-password')
        .lean(),
      User.countDocuments(query)
    ]);

    // Get product counts for all users in a single aggregation query
    const userEmails = users.map(u => u.email);
    const productCounts = await Product.aggregate([
      { $match: { useremail: { $in: userEmails } } },
      { $group: { _id: '$useremail', count: { $sum: 1 } } }
    ]);
    
    const countMap = productCounts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    const usersWithProductCount = users.map(user => ({
      ...user,
      productCount: countMap[user.email] || 0
    }));

    res.json({
      users: usersWithProductCount,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
});

// Get all products with pagination
router.get('/admin/products', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { owner: { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.catagory = category;
    }

    // Run products query and count in parallel with lean() for performance
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Product.countDocuments(query)
    ]);

    res.json({
      products,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

// Delete a user (admin only)
router.delete('/admin/users/:id', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Don't allow deleting admin users
    if (user.isAdmin) {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }

    // Delete user's products and their images from Cloudinary
    const userProducts = await Product.find({ useremail: user.email });
    
    for (const product of userProducts) {
      // Delete product images from Cloudinary
      for (let i = 1; i <= 12; i++) {
        const picField = `productpic${i}`;
        if (product[picField]) {
          try {
            const publicId = product[picField].match(/\/v\d+\/(\S+)\.\w+/)?.[1];
            if (publicId) {
              await cloudinary.uploader.destroy(publicId);
            }
          } catch (err) {
            console.error('Error deleting image:', err);
          }
        }
      }
    }

    // Delete all products by this user
    await Product.deleteMany({ useremail: user.email });

    // Delete the user
    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User and their products deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Failed to delete user' });
  }
});

// Delete a product (admin only)
router.delete('/admin/products/:id', adminAuth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Delete product images from Cloudinary
    for (let i = 1; i <= 12; i++) {
      const picField = `productpic${i}`;
      if (product[picField]) {
        try {
          const publicId = product[picField].match(/\/v\d+\/(\S+)\.\w+/)?.[1];
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
          }
        } catch (err) {
          console.error('Error deleting image:', err);
        }
      }
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ message: 'Failed to delete product' });
  }
});

// Toggle user admin status
router.patch('/admin/users/:id/toggle-admin', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Prevent removing own admin status
    if (user.email === req.user.userEmail) {
      return res.status(403).json({ message: 'Cannot modify your own admin status' });
    }

    user.isAdmin = !user.isAdmin;
    await user.save();

    res.json({ message: `User ${user.isAdmin ? 'promoted to' : 'removed from'} admin`, isAdmin: user.isAdmin });
  } catch (error) {
    console.error('Toggle admin error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Toggle user email verification
router.patch('/admin/users/:id/toggle-verified', adminAuth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.isEmailVerified = !user.isEmailVerified;
    await user.save();

    res.json({ message: `User email ${user.isEmailVerified ? 'verified' : 'unverified'}`, isEmailVerified: user.isEmailVerified });
  } catch (error) {
    console.error('Toggle verified error:', error);
    res.status(500).json({ message: 'Failed to update user' });
  }
});

// Get categories list for filter
router.get('/admin/categories', adminAuth, async (req, res) => {
  try {
    const categories = await Product.distinct('catagory');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
});

// Get all contact messages with pagination
router.get('/admin/contacts', adminAuth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const status = req.query.status || '';
    const search = req.query.search || '';
    const skip = (page - 1) * limit;

    let query = {};
    
    if (status) {
      query.status = status;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { subject: { $regex: search, $options: 'i' } }
      ];
    }

    const [contacts, total] = await Promise.all([
      Contact.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Contact.countDocuments(query)
    ]);

    res.json({
      contacts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get contacts error:', error);
    res.status(500).json({ message: 'Failed to fetch contacts' });
  }
});

// Update contact message status
router.patch('/admin/contacts/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['new', 'read', 'replied', 'resolved'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Status updated', contact });
  } catch (error) {
    console.error('Update contact status error:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
});

// Delete a contact message
router.delete('/admin/contacts/:id', adminAuth, async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Delete contact error:', error);
    res.status(500).json({ message: 'Failed to delete contact' });
  }
});

// Initialize admin user if doesn't exist
router.post('/admin/init', async (req, res) => {
  try {
    const adminEmail = 'naveedqadir0@gmail.com';
    
    const user = await User.findOne({ email: adminEmail });
    
    if (user) {
      if (!user.isAdmin) {
        user.isAdmin = true;
        await user.save();
        res.json({ message: 'User promoted to admin' });
      } else {
        res.json({ message: 'User is already an admin' });
      }
    } else {
      res.status(404).json({ message: 'Admin user not found. Please register first.' });
    }
  } catch (error) {
    console.error('Init admin error:', error);
    res.status(500).json({ message: 'Failed to initialize admin' });
  }
});

module.exports = router;
