const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'users', // Reference to users collection
      required: true,
    },
    items: [
      {
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
    status: {
      type: String,
      default: 'OrderPlaced',
      enum: ['OrderPlaced', 'Out for Delivery', 'Delivered', 'Canceled'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('orders', orderSchema);
