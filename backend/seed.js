require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const Destination = require('./models/Destination');

const demoDestinations = [
  {
    name: "Machu Picchu",
    location: "Cusco Region, Peru",
    description: "Iconic 15th-century Inca citadel situated on a mountain ridge.",
    images: ["machu_picchu1.jpg", "machu_picchu2.jpg"],
    rating: 4.9,
    budgetEstimate: 1200,
    bestTimeToVisit: "May to October",
    category: "mountain",
    coordinates: { lng: -72.544963, lat: -13.163141 }
  },
  {
    name: "Maldives Atolls",
    location: "Maldives",
    description: "Tropical paradise known for its beaches, blue lagoons and extensive reefs.",
    images: ["maldives1.jpg"],
    rating: 4.8,
    budgetEstimate: 3000,
    bestTimeToVisit: "November to April",
    category: "beach",
    coordinates: { lng: 73.220680, lat: 3.202778 }
  },
  {
    name: "Tokyo",
    location: "Honshu, Japan",
    description: "Bustling capital blending the ultramodern and the traditional.",
    images: ["tokyo1.jpg", "tokyo2.jpg"],
    rating: 4.7,
    budgetEstimate: 2000,
    bestTimeToVisit: "March to May, September to November",
    category: "city",
    coordinates: { lng: 139.6917, lat: 35.6895 }
  },
  {
    name: "Banff National Park",
    location: "Alberta, Canada",
    description: "Canada's oldest national park, encompassing rocky mountain peaks, turquoise glacial lakes, and a picture-perfect mountain town.",
    images: ["banff1.jpg"],
    rating: 4.9,
    budgetEstimate: 1500,
    bestTimeToVisit: "June to August",
    category: "mountain",
    coordinates: { lng: -115.9281, lat: 51.4968 }
  },
  {
    name: "Bora Bora",
    location: "French Polynesia",
    description: "Small South Pacific island northwest of Tahiti in French Polynesia, surrounded by sand-fringed motus and a turquoise lagoon protected by a coral reef.",
    images: ["borabora1.jpg"],
    rating: 4.8,
    budgetEstimate: 4000,
    bestTimeToVisit: "May to October",
    category: "beach",
    coordinates: { lng: -151.7415, lat: -16.5004 }
  },
  {
    name: "Paris",
    location: "Île-de-France, France",
    description: "France's capital, a major European city and a global center for art, fashion, gastronomy and culture.",
    images: ["paris1.jpg"],
    rating: 4.6,
    budgetEstimate: 1800,
    bestTimeToVisit: "April to June, October to early November",
    category: "city",
    coordinates: { lng: 2.3522, lat: 48.8566 }
  }
];

const seedDatabase = async () => {
  try {
    await connectDB();
    
    // Clear existing destinations to avoid duplicates
    await Destination.deleteMany();
    console.log('Existing destinations removed');
    
    // Insert demo destinations
    await Destination.insertMany(demoDestinations);
    console.log('Demo destinations seeded successfully!');
    
    process.exit();
  } catch (error) {
    console.error(`Error with seeding: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
