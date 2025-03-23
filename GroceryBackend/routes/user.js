const router = require('express').Router();
const User = require('../models/user');
const Item = require('../models/item');
const bcrypt = require('bcryptjs');
const zod = require('zod');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const middleware = require('../middleware');
const mongoose = require('mongoose');

const signupSchema = zod.object({
    username: zod.string().min(4, "Username must be at least 4 characters long"),
    email: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters long").regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/),
    address: zod.string().nonempty("Address is required"),
});

router.post('/signup', async (req, res) => {
    try {
        // Validate the request body
        const validationResult = signupSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid inputs',
                errors: validationResult.error.errors.map(err => ({
                    path: err.path.join('.'),
                    message: err.message,
                })),
            });
        }
        const { username, email, password, address } = validationResult.data;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        // Check if the email already exists
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = await User.create({
            username,
            email,
            password: hashedPassword,
            address,
        });

        // Generate JWT token
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET
        );

        // Return the user and the token
        res.status(201).json({
            message: 'User created successfully',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token,
        });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

// Sign in

const signinSchema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters long"),
})

router.post('/signin', async(req,res) => {
    const { success } = signinSchema.safeParse(req.body);
    if(!success) {
        return res.status(400).json({ error: 'Invalid inputs' });
    }
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if(!user) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    
    res.json({
        message: 'User authenticated successfully',
        user:{
            id: user._id,
            username: user.username,
            email:user.email,
            role: user.role
        },
        token,
    });
});

// Get user profile

router.get('/profile', middleware, async (req, res) => {
    try {
        if (!req.userId) {
            return res.status(401).json({ message: 'Unauthorized' });
        }

        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Assuming these properties are present in the user document
        return res.json({
            message: 'User profile fetched successfully',
            user: {
                 user 
            },
        });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});

//update profile

const updateProfile = zod.object({
    username: zod.string().min(4, "Username must be at least 4 characters long"),
    email: zod.string().email(),
    password: zod.string().min(6, "Password must be at least 6 characters long").regex(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}/),
    address: zod.string().nonempty("Address is required")
});

router.put('/update',middleware, async (req,res) =>{
    const { success } = updateProfile.safeParse(req.body);
    if(!success) {
        return res.status(400).json({ error: 'Invalid inputs' });
    }
    await User.updateOne({_id: req.userId},req.body);
    res.json({message: 'Profile updated successfully'});  
});

// Add to Cart Route



router.put('/add-to-cart',middleware, async (req, res) => {
    const userId = req.headers['userid'];
    const itemId = req.headers['itemid'];
    const { quantity, unit } = req.body;
  
    try {
      // Validate headers and body
      if (!userId || !itemId) {
        return res.status(400).json({ error: 'Missing userId or itemId in headers' });
      }
      if (!quantity || !unit) {
        return res.status(400).json({ error: 'Missing quantity or unit in request body' });
      }
  
      // Validate unit
      const validUnits = ['kg', 'gm', 'L', 'ml', 'item'];
      if (!validUnits.includes(unit)) {
        return res.status(400).json({ error: 'Invalid unit provided' });
      }

  
      // Convert itemId to ObjectId
      const objectIdItem = new mongoose.Types.ObjectId(itemId);
  
      // Fetch the user
      const user = await User.findById(userId).populate({
        path: 'cart.item',
        model: 'items', // Ensure 'Item' matches the name of your item model
      });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      const item = await Item.findById(itemId);
      if(!item) return res.status(404).json({ error: 'Item not found' });


  
      // Check if the item already exists in the cart
      const existingCartItem = user.cart.find(
        (cartItem) => cartItem.item.toString() === itemId
      );
  
      if (existingCartItem) {
        // Update the quantity of the existing item
        existingCartItem.quantity.value += quantity;
        existingCartItem.quantity.unit = unit; // Update unit if needed
      } else {
        // Add the new item to the cart
        user.cart.push({
          item: objectIdItem,
          quantity: { value: quantity, unit: unit },
        });

      }

      const itemQuantity = item.quantity.find((q) => q.unit === unit);
      itemQuantity.value -= quantity;
      // Save the updated user document
      await user.save();
      await item.save();
  
      const updatedUser = await User.findById(userId).populate('cart.item');

      res.status(200).json({ 
        message: 'Item added to cart successfully!', 
        cart: updatedUser.cart 
      });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'An error occurred while adding to cart!', details: error.message });
    }
  });
  


//remove item from cart

router.put('/remove-from-cart', middleware, async (req, res) => {
    try {
      const userId = req.headers['userid'];
      const cartItemId = req.headers['cartitemid'];
  
      if (!userId || !cartItemId) {
        return res.status(400).json({ error: 'Missing userId or cartItemId in headers' });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Find the cart item to remove
      const cartItem = user.cart.find((cartItem) => cartItem.cartItemId.toString() === cartItemId);
      if (!cartItem) {
        return res.status(404).json({ error: 'Cart item not found' });
      }
  
      const item = await Item.findById(cartItem.item);
      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }
  
      // Increment the available quantity
      const itemQuantity = item.quantity.find((q) => q.unit === cartItem.quantity.unit);
      if (itemQuantity) {
        itemQuantity.value += cartItem.quantity.value;
      }
  
      // Remove the cart item
      user.cart = user.cart.filter((cartItem) => cartItem.cartItemId.toString() !== cartItemId);
  
      await user.save();
      await item.save();
  
      res.status(200).json({ message: 'Item removed from cart successfully!', cart: user.cart });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  

//get cart items

router.get('/get-cart-items', middleware, async (req, res) => {
    try {
        const userId = req.headers['userid'];

        if (!userId) {
            return res.status(400).json({ error: "Missing userId in headers" });
        }

          const user = await User.findById(userId).populate("cart.item");
          const itemDetails = await Item.findById(user.cart.item);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({ message: "Cart items fetched successfully", cartItems: user.cart });
    } catch (e) {
        return res.status(500).json({ error: e.message });
    }
});


module.exports = router;
