const router = require('express').Router();
const Item = require('../models/item');
const User = require('../models/user');
const zod = require('zod');
require('dotenv').config();
const middleware = require('../middleware');

const itemSchema = zod.object({
    imageUrl: zod.string().url({ message: "Invalid URL format" }), // Validate URL for image
    name: zod.string().min(1, { message: "Name is required" }), // Ensure name is not empty
    price: zod.number().positive({ message: "Price must be a positive number" }), // Price must be > 0
    category: zod.enum(['Extra', 'Grains', 'Dairy & Bakery', 'Pulses', 'Snacks', 'Spices']), // Restrict to predefined categories
    quantity: zod.array(
        zod.object({
            value: zod.number().positive({ message: "Quantity must be positive" }), // Value must be > 0
            unit: zod.enum(['kg', 'gm', 'L', 'ml', 'item']) // Valid units
        })
    ).nonempty({ message: "At least one quantity option is required" }) // Ensure at least one quantity is provided
});

router.post('/addItem', middleware, async (req, res) => {
    try {
        const id  = req.headers.userid;
        // console.log(id);
        
        // Check if `id` is provided
        if (!id) {
            return res.status(400).json({
                message: 'User ID is required in headers'
            });
        }

        // Fetch user from the database
        const user = await User.findById(id);
        
        // Handle case where user is not found
        if (!user) {
            return res.status(404).json({
                message: 'User not found'
            });
        }

        // Check if user is admin
        if (user.role !== "admin") {
            return res.status(403).json({
                message: 'Only admin can add items'
            });
        }

        // Validate request body with Zod
        const validationResult = itemSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid item data',
                errors: validationResult.error.issues
            });
        }

        const { imageUrl, name, price, category, quantity } = validationResult.data;

        // Create item
        const item = await Item.create({
            imageUrl,
            name,
            price,
            category,
            quantity
        });

        return res.status(201).json({
            message: 'Item added successfully',
            item
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: 'Error adding item',
            error: err.message
        });
    }
});


//update item
const updateItemSchema = zod.object({
     // ID is mandatory for update
    imageUrl: zod.string().url({ message: "Invalid URL format" }).optional(), // Optional fields
    name: zod.string().min(1, { message: "Name must not be empty" }).optional(),
    price: zod.number().positive({ message: "Price must be positive" }).optional(),
    category: zod.enum(['Extra', 'Grains', 'Dairy & Bakery', 'Pulses', 'Snacks', 'Spices']).optional(),
    quantity: zod.array(
        zod.object({
            value: zod.number().positive({ message: "Quantity must be positive" }),
            unit: zod.enum(['kg', 'gm', 'L', 'ml', 'item']),
        })
    ).optional(),
});
router.put('/updateItem', middleware, async (req, res) => {
    try {
        const { id: userId, itemid } = req.headers; // Extract userId and itemid
        const itemId = itemid?.trim();

        // Validate admin role
        const user = await User.findById(userId);
        if (!user || user.role !== "admin") {
            return res.status(403).json({
                message: 'Only admin can update items',
            });
        }

        // Validate item ID format
        if (!itemId || !/^[a-f\d]{24}$/i.test(itemId)) {
            return res.status(400).json({
                message: 'Invalid or missing Item ID in headers',
            });
        }

        // Parse and validate update data
        const validationResult = updateItemSchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({
                message: 'Invalid inputs',
                errors: validationResult.error.issues,
            });
        }

        const updateData = validationResult.data;

        // Update the item
        const updatedItem = await Item.findByIdAndUpdate(
            itemId,
            updateData,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({
                message: 'Item not found',
            });
        }

        return res.status(200).json({
            message: 'Item updated successfully',
            item: updatedItem,
        });
    } catch (err) {
        return res.status(500).json({
            message: 'Error updating item',
            error: err,
        });
    }
});
//get all items

router.get('/get-all-items', async (req,res) => {
    try{
        const items = await Item.find().sort({createdAt: -1});
        return res.status(200).json({
            message: 'Items fetched successfully',
            items
        });
    }catch(err){
        return res.status(500).json({
            message: 'Error fetching items',
            error: err
        });
    }
});

//get item by id

router.get('/get-item/:id', async (req,res) => {
    try{
        const itemId = req.params.id;
        const item = await Item.findById(itemId);
        if(!item){
            return res.status(404).json({
                message: 'Item not found'
            });
        }
        return res.status(200).json({
            message: 'Item fetched successfully',
            item
        });
    }catch(err){
        return res.status(500).json({
            message: 'Error fetching item',
            error: err
        });
    }
});

// Get items by category
router.get('/items', async (req, res) => {
    try {
        const { category } = req.query; // Read category from query parameters

        if (!category) {
            return res.status(400).json({
                status: 'Error',
                message: 'Category is required to fetch items.',
            });
        }

        // Fetch items with the specified category
        const items = await Item.find({ category });

        res.json({
            status: 'Success',
            items,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            status: 'Error',
            message: 'Failed to fetch items by category.',
            error: err.message,
        });
    }
});

// Delete item
router.delete('/deleteItem', middleware, async (req, res) => {
    try {
        const itemid = req.headers.itemid; // Ensure case sensitivity (itemId vs itemid)
        // console.log(itemid);

        // Check if `itemid` is provided
        if (!itemid) {
            return res.status(400).json({ message: 'Item ID is required in headers' });
        }

        // Attempt to delete the item
        const deletedItem = await Item.findByIdAndDelete(itemid);

        // If no item was found with the given ID
        if (!deletedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        // Item successfully deleted
        return res.status(200).json({ message: 'Item deleted successfully' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: `Error: ${err.message}` });
    }
});

module.exports = router;
