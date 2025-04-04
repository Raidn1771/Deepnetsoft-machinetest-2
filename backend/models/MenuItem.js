const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    ingredients: {
      type: [String],
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true }
);

// Add static method to get all categories
menuItemSchema.statics.getCategories = async function () {
  return this.distinct('category');
};

module.exports = mongoose.model('MenuItem', menuItemSchema);
