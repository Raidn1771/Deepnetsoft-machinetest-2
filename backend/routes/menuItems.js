const express = require('express');
const MenuItem = require('../models/MenuItem');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { category } = req.query;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required',
      });
    }

    const menuItems = await MenuItem.find({ category }).select(
      'name ingredients price'
    );

    res.json({
      success: true,
      count: menuItems.length,
      data: menuItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const categories = await MenuItem.getCategories();
    res.json({
      success: true,
      data: categories,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, category, ingredients, price } = req.body;

    // Validation
    if (!name || !category || !ingredients || !price) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const newItem = new MenuItem({
      name,
      category: category.toLowerCase(),
      ingredients: Array.isArray(ingredients)
        ? ingredients
        : ingredients.split(',').map(i => i.trim()),
      price: parseFloat(price),
    });

    await newItem.save();

    res.status(201).json({
      success: true,
      data: newItem,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});

module.exports = router;
