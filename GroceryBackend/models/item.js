const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    imageUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      enum: ['Extra', 'Grains', 'Dairy & Bakery', 'Pulses', 'Snacks', 'Spices'],
      required: true,
    },
    quantity: {
      type: [
        {
          value: { type: Number, required: true }, // Quantity value
          unit: {
            type: String,
            enum: ['kg', 'gm', 'L', 'ml', 'item'], // Allowed units
            required: true,
          },
        },
      ],
      default: [], // Start with an empty array
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('items', itemSchema);
