require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Required for many hosted Postgres services like Supabase/Render
    }
});

pool.on('connect', () => {
    console.log("Connected to the PostgreSQL database.");
});

const initializeDatabase = async () => {
    try {
        // Create user table
        await pool.query(`CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE,
            password TEXT,
            email TEXT
        )`);

        // Create items table
        await pool.query(`CREATE TABLE IF NOT EXISTS items (
            id SERIAL PRIMARY KEY,
            category TEXT,
            name TEXT,
            price TEXT,
            "desc" TEXT,
            img TEXT,
            rating DECIMAL,
            is_available INTEGER DEFAULT 1
        )`);

        // Create cart table
        await pool.query(`CREATE TABLE IF NOT EXISTS cart_items (
            id SERIAL PRIMARY KEY,
            name TEXT,
            price TEXT,
            quantity INTEGER,
            img TEXT
        )`);

        // Create orders table
        await pool.query(`CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            items TEXT,
            total DECIMAL,
            order_code TEXT,
            payment_method TEXT,
            date TEXT,
            status TEXT DEFAULT 'Pending',
            parent_order_id INTEGER DEFAULT NULL,
            payment_status TEXT DEFAULT 'Paid'
        )`);

        // Create notifications table
        await pool.query(`CREATE TABLE IF NOT EXISTS notifications (
            id SERIAL PRIMARY KEY,
            user_id INTEGER,
            message TEXT,
            order_id INTEGER,
            is_read INTEGER DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`);

        console.log("PostgreSQL Tables Checked/Created.");

        // Seeding logic
        const { rows } = await pool.query("SELECT count(*) as count FROM items");
        if (parseInt(rows[0].count) === 0) {
            console.log("Seeding database...");
            const foodData = [
                { category: 'lunch', name: 'Mini Lunch', price: '₹58', desc: 'Rice, dal, sabzi', img: 'https://img.freepik.com/premium-photo/indian-mini-meal-parcel-platter-combo-thali-with-gobi-masala-roti-dal-tarka-jeera-rice-salad_466689-87329.jpg' },
                { category: 'lunch', name: 'Special Lunch', price: '₹103', desc: 'Premium thali', img: 'https://media-cdn.tripadvisor.com/media/photo-s/10/70/44/99/special-lunch-thali.jpg' },
                { category: 'lunch', name: 'Biryani Bowl', price: '₹63', desc: 'Fragrant rice dish', img: 'https://www.cubesnjuliennes.com/wp-content/uploads/2020/07/Chicken-Biryani-Recipe.jpg' },
                { category: 'snacks', name: 'Vada Pav', price: '₹15', desc: 'Spicy potato fritter', img: 'https://content.jdmagicbox.com/v2/comp/delhi/e7/011pxx11.xx11.141018093131.c2e7/catalogue/rinki-vadapao-shalimar-bagh-delhi-vada-pav-centres-2iq2i34.jpg' },
                { category: 'snacks', name: 'Samosa', price: '₹17', desc: 'Crispy pastry', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSN5rqynMnDyZSUEmvJrWyoe2lVR5NqU7eL8w&s' },
                { category: 'snacks', name: 'Pakora', price: '₹20', desc: 'Spiced fritters', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:GcS9tzs50B-Vz_bymuySlEUPje3a3F6cQpHg_A&s' },
                { category: 'breakfast', name: 'Idli Sambar', price: '₹28', desc: 'Soft rice cakes', img: 'https://vaya.in/recipes/wp-content/uploads/2018/02/Idli-and-Sambar-1.jpg' },
                { category: 'breakfast', name: 'Poha', price: '₹22', desc: 'Flattened rice curry', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSpnIwQ79XUuyxcet-fVoPJf2iplEspFK5DJQ&s' },
                { category: 'breakfast', name: 'Upma', price: '₹20', desc: 'Semolina breakfast', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR62An25qATwuE83QS6U4uid1_fK5kigq9gMQ&s' },
                { category: 'chinese', name: 'Fried Rice', price: '₹75', desc: 'Veg fried rice', img: 'https://www.sharmispassions.com/wp-content/uploads/2011/01/VegFriedRice2.jpg' },
                { category: 'chinese', name: 'Veg Noodles', price: '₹85', desc: 'Stir-fried veg noodles', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSOtHkeg3ozBJdDw_AxSa-F_y7X1UDMc8VjKw&s' },
                { category: 'chinese', name: 'Chinese Bhel', price: '₹65', desc: 'Tangy crunchy bhel', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTVFd7IOLQGT2U7WZX8UVjiGG9UH7KsJv6MKA&s' }
            ];

            for (const item of foodData) {
                await pool.query("INSERT INTO items (category, name, price, \"desc\", img) VALUES ($1, $2, $3, $4, $5)",
                    [item.category, item.name, item.price, item.desc, item.img]);
            }
            console.log("PostgreSQL Database seeded.");
        }
    } catch (err) {
        console.error("Database initialization error:", err);
    }
};

initializeDatabase();

module.exports = {
    query: (text, params) => pool.query(text, params),
    pool
};
