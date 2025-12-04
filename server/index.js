const express = require("express");
const mongoose = require("mongoose");

const Product = require('./models/Product');

const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const auth = require("./middleware/auth");
require('dotenv').config();

const authRoutes = require('./authRoutes/authRoutes');
const googleAuthRoutes = require('./authRoutes/googleAuthRoutes');
const chatRoutes = require('./chatRoutes/chatRoutes');
const profileRoutes = require('./profileRoutes/profileRoutes');
const contactRoutes = require('./contactRoutes/contactRoutes');
const adminRoutes = require('./adminRoutes/adminRoutes');


const cloudinary = require('cloudinary').v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


app.use(cors());
app.use(bodyParser.json());

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection error:", error.message);
  });

app.use('/', authRoutes); 
app.use('/', googleAuthRoutes);
app.use('/', profileRoutes);
app.use('/', chatRoutes);
app.use('/', contactRoutes);
app.use('/', adminRoutes);


app.post("/add_product", auth, async (req, res) => {
  try {
    const { title, description, address, price, uploadedFiles, name, catagory, subcatagory, image } = req.body;
    
    // Validation
    const errors = [];
    
    if (!title || title.trim().length === 0) {
      errors.push("Title is required");
    } else if (title.length < 3) {
      errors.push("Title must be at least 3 characters");
    } else if (title.length > 100) {
      errors.push("Title must be less than 100 characters");
    }
    
    if (!description || description.trim().length === 0) {
      errors.push("Description is required");
    } else if (description.length < 10) {
      errors.push("Description must be at least 10 characters");
    } else if (description.length > 5000) {
      errors.push("Description must be less than 5000 characters");
    }
    
    if (!address || (typeof address === 'object' && Object.keys(address).length === 0)) {
      errors.push("Location is required");
    }
    
    if (!price || isNaN(price) || price <= 0) {
      errors.push("Valid price is required");
    } else if (price > 100000000) {
      errors.push("Price cannot exceed ₹10 crore");
    }
    
    if (!uploadedFiles || uploadedFiles.length === 0) {
      errors.push("At least one product image is required");
    } else if (uploadedFiles.length > 12) {
      errors.push("Maximum 12 images allowed");
    }
    
    if (!name || name.trim().length === 0) {
      errors.push("Seller name is required");
    }
    
    if (!catagory) {
      errors.push("Category is required");
    }
    
    if (!subcatagory) {
      errors.push("Subcategory is required");
    }
    
    if (errors.length > 0) {
      return res.status(400).json({ 
        message: "Validation failed", 
        errors: errors 
      });
    }

    // Create a new Product document
    const product = new Product({
      useremail: req.user.userEmail,
      title: title.trim(),
      description: description.trim(),
      address: address,
      price: price,
      owner: name.trim(),
      ownerpicture: image || '',
      catagory: catagory,
      subcatagory: subcatagory,
    });

    // Save the uploaded files in pic1 to pic12 fields
    for (let i = 0; i < uploadedFiles.length && i < 12; i++) {
      const fieldName = `productpic${i + 1}`;
      product[fieldName] = uploadedFiles[i];
    }
    // Save the product document
    await product.save();

    res.status(200).json({ message: "The product has been saved successfully.", productId: product._id });
  } catch (err) {
    console.error("Error saving product:", err);
    res.status(500).json({ message: "Failed to save the product." });
  }
});

app.get("/myads_view", auth, async (req, res) => {
  try {
    const useremail = req.user.userEmail;
    const products = await Product.find({ useremail });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.delete("/myads_delete/:id", auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      useremail: req.user.userEmail,
    });

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    else{
    // delete the ownerpicture from Cloudinary if it exists
    if (product.ownerpicture) {
      const publicId = product.ownerpicture.match(/\/v\d+\/(\S+)\.\w+/)[1];
      const result = await cloudinary.uploader.destroy(publicId);
      
    }

    // delete the product pictures from Cloudinary if they exist
    for (let i = 1; i <= 12; i++) {
      const productPic = `productpic${i}`;
      if (product[productPic]) {
        const publicId = product[productPic].match(/\/v\d+\/(\S+)\.\w+/)[1];
        const result = await cloudinary.uploader.destroy(publicId);
        
      }
    }

    res.send(product);
  }
  } catch (error) {
    
    res.status(500).send({ error: "Server Error" });
  }
});

app.post("/previewad/:id", auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }
    else{
    let own = false;
    if (product.useremail === req.user.userEmail) {
      own = true;
    }
    res.send({ product, own });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

app.post("/previewad/notloggedin/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }else{
    res.send({ product });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
}); 

app.get("/getProducts", async (req, res) => {
  const products = await Product.find();
  res.status(200).send(products);
});

app.get("/getProductsbyCategory/:category", async (req, res) => {
  const { category } = req.params;
  const products = await Product.find({
    $or: [{ catagory: category }, { subcatagory: category }],
  });
  res.status(200).send(products);
});

app.get("/search", async (req, res) => {
  const { q } = req.query;
  try {
    const products = await Product.find({
      title: { $regex: q, $options: "i" },
    });
    res.status(200).send(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.get("/getProductsbyemail", async (req, res) => {
  const { useremail } = req.query;
  const products = await Product.find({ useremail: useremail });
  res.status(200).send(products);
});


app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});
