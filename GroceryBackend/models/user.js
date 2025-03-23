const mongoose = require('mongoose');
// Import the Item model if needed for registration consistency
// const Item = require('../models/item');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    address:
      {
        type: String,
        required: true,
      },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    avatar: {
      type: String,
      default: 'https://cdn-icons-png.flaticon.com/128/3177/3177440.png',
    },
    cart: [
      {
        cartItemId: {
          type: mongoose.Types.ObjectId,
          default: () => new mongoose.Types.ObjectId(),
        },
        item: {
          type: mongoose.Types.ObjectId,
          ref: 'items', // Reference to items collection
          required: true,
        },
        quantity: {
          value: { type: Number, required: true },
          unit: {
            type: String,
            enum: ['kg', 'gm', 'L', 'ml', 'item'],
            required: true,
          },
        },
      },
    ],
    orders: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'orders',
      },
    ],
  },
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Export the User model
module.exports = mongoose.model('users', userSchema);
