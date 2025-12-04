const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const User = require('../models/User');
const Product = require('../models/Product');
const Message = require('../models/Message');
const cloudinary = require('cloudinary').v2;

// Check if user is admin
router.get('/admin/check', adminAuth, async (req, res) => {
  try {
    res.json({ isAdmin: true, email: req.user.userEmail });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get dashboard statistics
router.get('/admin/stats', adminAuth, async (req, res) => {
  try {
    // Get counts
    const totalUsers = await User.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalMessages = await Message.countDocuments();
    const verifiedUsers = await User.countDocuments({ isEmailVerified: true });

    // Get users registered in last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get products created in last 30 days
    const newProductsThisMonth = await Product.countDocuments({
      createdAt: { $gte: thirtyDaysAgo }
    });

    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: '$catagory',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get products created per day for last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    
    const productsPerDay = await Product.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get users registered per day for last 7 days
    const usersPerDay = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sevenDaysAgo }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Get top sellers (users with most products)
    const topSellers = await Product.aggregate([
      {
        $group: {
          _id: '$useremail',
          productCount: { $sum: 1 },
          owner: { $first: '$owner' }
        }
      },
      { $sort: { productCount: -1 } },
      { $limit: 5 }
    ]);

    // Get price statistics
    const priceStats = await Product.aggregate([
      {
        $addFields: {
          numericPrice: { $toDouble: '$price' }
        }
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: '$numericPrice' },
          maxPrice: { $max: '$numericPrice' },
          minPrice: { $min: '$numericPrice' },
          totalValue: { $sum: '$numericPrice' }
        }
      }
    ]);

    // Get recent products
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('title price owner catagory createdAt useremail');

    // Get recent users
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email isEmailVerified createdAt picture');

    res.json({
      overview: {
        totalUsers,
        totalProducts,
        totalMessages,
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
      recentUsers
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

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select('-password');

    const total = await User.countDocuments(query);

    // Get product count for each user
    const usersWithProductCount = await Promise.all(
      users.map(async (user) => {
        const productCount = await Product.countDocuments({ useremail: user.email });
        return {
          ...user.toObject(),
          productCount
        };
      })
    );

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

    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments(query);

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
