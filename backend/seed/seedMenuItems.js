const mongoose = require('mongoose');
const MenuItem = require('../models/MenuItem');
const connectDB = require('../config/db');

// Sample data
const menuItems = [
  {
    name: 'Margherita Pizza',
    category: 'food',
    ingredients: ['Tomato sauce', 'Fresh mozzarella', 'Basil'],
    price: 12.99,
  },
  {
    name: 'Pepperoni Pizza',
    category: 'food',
    ingredients: ['Tomato sauce', 'Mozzarella', 'Pepperoni'],
    price: 14.99,
  },
  {
    name: 'Mimosa',
    category: 'brunch',
    ingredients: ['Champagne', 'Orange juice'],
    price: 8.5,
  },
  {
    name: 'Bloody Mary',
    category: 'brunch',
    ingredients: ['Vodka', 'Tomato juice', 'Spices'],
    price: 9.0,
  },
  {
    name: 'Classic Burger',
    category: 'food',
    ingredients: ['Beef patty', 'Lettuce', 'Tomato', 'Onion'],
    price: 10.99,
  },
  {
    name: 'Craft Beer',
    category: 'drinks',
    ingredients: ['Hops', 'Barley', 'Yeast'],
    price: 6.5,
  },
];

const seedDB = async () => {
  try {
    await connectDB();
    await MenuItem.deleteMany();
    await MenuItem.insertMany(menuItems);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedDB();
