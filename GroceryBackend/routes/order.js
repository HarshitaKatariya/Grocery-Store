const router = require("express").Router();
const middleware = require("../middleware"); // Ensure middleware is correctly imported
const User = require("../models/user");
const Order = require("../models/order");
const Item = require("../models/item");

router.post("/place-order", middleware, async (req, res) => {
    try {
      const userId = req.headers.userid;
    //   console.log(userId);


  
      // Find the user
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      console.log(user.cart);
      if (!user.cart || user.cart.length === 0) {
        return res.status(400).json({ error: "Cart is empty." });
      }
  
      // Validate each item in the cart
      const orderItems = [];
      for (const cartItem of user.cart) {
        const item = await Item.findById(cartItem.item);
        // console.log(cartItem);
        // console.log(item);
        // console.log(cartItem.item);
        if (!item) {
          return res
            .status(404)
            .json({ error: `Item with ID ${cartItem.item} not found.` });
        }
        orderItems.push({
          item: cartItem.item,
          quantity: cartItem.quantity,
        });
      }
  
      // Create the order
      const newOrder = new Order({
        user: userId,
        items: orderItems,
      });
      await newOrder.save();

      // console.log(user.orders);
  
      // Add the new order to the user's orders array and clear the cart
    user.orders.push(newOrder);
    console.log("Updated orders array before saving:", user.orders);

      // Clear the user's cart
      user.cart = [];
      await user.save();
  
      res.json({
        status: "Success",
        message: "Order placed successfully, and cart cleared.",
        orderId: newOrder._id,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  });
  

  router.get("/order-history", middleware, async (req, res) => {
    try {
      const userId = req.headers.userid; // Assuming `userid` is passed in headers
  
      if (!userId) {
        return res.status(400).json({ error: "User ID not provided." });
      }
  
      // Fetch orders for the user
      const orders = await Order.find({ user: userId })
        .populate({
          path: "items.item", // Populate the `item` field inside `items` array
          model: Item, // Model to use for population
          select: "name price imageUrl category", // Fields to include
        })
        .sort({ createdAt: -1 }); // Sort orders by most recent
  
      if (orders.length === 0) {
        return res.status(404).json({ message: "No orders found for this user." });
      }
  
      // Structure the response data
      const formattedOrders = orders.map((order) => ({
        orderId: order._id,
        status: order.status,
        createdAt: order.createdAt,
        items: order.items.map((item) => ({
          name: item.item?.name || "Unknown",
          price: item.item?.price || 0,
          imageUrl: item.item?.imageUrl || "",
          category: item.item?.category || "Uncategorized",
          quantity: item.quantity,
        })),
      }));
  
      res.json({
        status: "Success",
        orders: formattedOrders,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "An error occurred while fetching orders." });
    }
  });
  
  module.exports = router;

  
// Admin-only middleware
const adminCheck = async (req, res, next) => {
  try {
    const userId = req.userId; // Assuming middleware attaches user to `req.user`
    // console.log(userId);
    const user = await User.findById(userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        status: "Error",
        message: "Access denied. Admins only.",
      });
    }

    next(); // User is an admin; proceed to the route handler
  } catch (err) {
    // console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Failed to verify admin privileges",
      error: err.message,
    });
  }
};
// Get all orders - Admin only
router.get("/get-all-orders", middleware, adminCheck, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "items.item",
        select: "name price category quantity imageUrl",
      })
      .populate({
        path: "user",
        select: "username email address avatar",
      })
      .sort({ createdAt: -1 });
      
    res.json({
      status: "Success",
      orders,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Failed to fetch orders",
      error: err.message,
    });
  }
});

// Update order status - Admin only
router.put("/update-status/:id", middleware, adminCheck, async (req, res) => {
  try {
    const orderId = req.params.id;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        status: "Error",
        message: "Status is required to update the order.",
      });
    }

    await Order.findByIdAndUpdate(orderId, { status });

    res.json({
      status: "Success",
      message: "Order status updated successfully.",
    });
  } catch (err) {

    console.error(err);
    res.status(500).json({
      status: "Error",
      message: "Failed to update order status",
      error: err.message,
    });
  }
});

module.exports = router;
