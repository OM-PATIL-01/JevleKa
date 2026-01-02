const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '/')));

// Simple error handler wrapper
const asyncHandler = fn => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

// API: Notifications
app.get('/api/notifications', asyncHandler(async (req, res) => {
    const user_id = req.query.user_id;
    if (!user_id) return res.json({ data: [] });

    const { rows } = await db.query("SELECT * FROM notifications WHERE user_id = $1 ORDER BY id DESC", [user_id]);
    res.json({ data: rows });
}));

app.post('/api/notifications/mark-read', asyncHandler(async (req, res) => {
    const { id } = req.body;
    await db.query("UPDATE notifications SET is_read = 1 WHERE id = $1", [id]);
    res.json({ message: "Marked as read" });
}));

app.post('/api/notifications', asyncHandler(async (req, res) => {
    const { user_id, message, order_id } = req.body;
    await db.query("INSERT INTO notifications (user_id, message, order_id) VALUES ($1, $2, $3)",
        [user_id, message, order_id]);
    res.json({ message: "Notification sent" });
}));

// API: Swap Order Item
app.post('/api/orders/swap', asyncHandler(async (req, res) => {
    const { original_order_id, new_items, new_total, price_diff, payment_method } = req.body;

    // 1. Update status of old order
    await db.query("UPDATE orders SET status = 'Replaced' WHERE id = $1", [original_order_id]);

    // 2. Create new order
    const payment_status = price_diff < 0 ? 'Refunded' : 'Paid';
    const date = new Date().toLocaleString();

    // fetch old order to get user_id
    const { rows: userRows } = await db.query("SELECT user_id FROM orders WHERE id = $1", [original_order_id]);
    if (userRows.length === 0) return res.status(404).json({ error: "Order not found" });

    const sql = "INSERT INTO orders (user_id, items, total, order_code, payment_method, date, status, parent_order_id, payment_status) VALUES ($1, $2, $3, $4, $5, $6, 'Pending', $7, $8) RETURNING id";
    const newCode = 'ORD-' + Math.floor(1000 + Math.random() * 9000);

    const { rows: orderRows } = await db.query(sql, [userRows[0].user_id, JSON.stringify(new_items), new_total, newCode, payment_method, date, original_order_id, payment_status]);

    res.json({ message: "Order swapped successfully", new_order_id: orderRows[0].id, refund_amount: price_diff < 0 ? Math.abs(price_diff) : 0 });
}));

// Create Order
app.post('/api/orders', asyncHandler(async (req, res) => {
    const { user_id, items, total, order_code, payment_method, date } = req.body;
    const sql = "INSERT INTO orders (user_id, items, total, order_code, payment_method, date, status) VALUES ($1, $2, $3, $4, $5, $6, 'Pending') RETURNING id";
    const { rows } = await db.query(sql, [user_id, items, total, order_code, payment_method, date]);
    res.json({ message: "Order created", id: rows[0].id });
}));

// Get Orders
app.get('/api/orders', asyncHandler(async (req, res) => {
    const user_id = req.query.user_id;
    let sql = "SELECT * FROM orders ORDER BY id DESC";
    let params = [];

    if (user_id) {
        sql = "SELECT * FROM orders WHERE user_id = $1 ORDER BY id DESC";
        params = [user_id];
    }

    const { rows } = await db.query(sql, params);
    res.json({ message: "success", data: rows });
}));

// Update Order Status
app.put('/api/orders/:id/status', asyncHandler(async (req, res) => {
    const { status } = req.body;
    await db.query("UPDATE orders SET status = $1 WHERE id = $2", [status, req.params.id]);
    res.json({ message: "Status updated" });
}));

// Toggle Item Availability
app.put('/api/items/:id/toggle', asyncHandler(async (req, res) => {
    const { is_available } = req.body;
    await db.query("UPDATE items SET is_available = $1 WHERE id = $2", [is_available ? 1 : 0, req.params.id]);
    res.json({ message: "Availability updated" });
}));

// Get Menu Items
app.get('/api/menu', asyncHandler(async (req, res) => {
    const category = req.query.category;
    let sql = "SELECT * FROM items";
    const params = [];

    if (category) {
        sql += " WHERE category = $1";
        params.push(category);
    }

    const { rows } = await db.query(sql, params);
    res.json({ message: "success", data: rows });
}));

// Login
app.post('/api/login', asyncHandler(async (req, res) => {
    const { username, password } = req.body;
    const { rows } = await db.query("SELECT * FROM users WHERE username = $1 AND password = $2", [username, password]);

    if (rows.length > 0) {
        res.json({ message: "Login successful", user: { id: rows[0].id, username: rows[0].username, email: rows[0].email } });
    } else {
        res.status(401).json({ message: "Invalid credentials" });
    }
}));

// Register
app.post('/api/register', asyncHandler(async (req, res) => {
    const { username, password, email } = req.body;

    // Check if user exists
    const { rows: existing } = await db.query("SELECT * FROM users WHERE username = $1", [username]);
    if (existing.length > 0) {
        return res.status(400).json({ message: "Username already exists" });
    }

    const { rows } = await db.query("INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING id", [username, password, email]);
    res.json({ message: "User created successfully", id: rows[0].id });
}));

// Add to Cart
app.post('/api/cart', asyncHandler(async (req, res) => {
    const { name, price, img } = req.body;

    const { rows } = await db.query("SELECT * FROM cart_items WHERE name = $1", [name]);

    if (rows.length > 0) {
        const { rows: updated } = await db.query("UPDATE cart_items SET quantity = quantity + 1 WHERE id = $1 RETURNING *", [rows[0].id]);
        res.json({ message: "Updated quantity", data: updated[0] });
    } else {
        const { rows: inserted } = await db.query("INSERT INTO cart_items (name, price, quantity, img) VALUES ($1, $2, 1, $3) RETURNING *", [name, price, img]);
        res.json({ message: "Added to cart", data: inserted[0] });
    }
}));

// Reduce Cart Quantity
app.post('/api/cart/reduce', asyncHandler(async (req, res) => {
    const { id } = req.body;
    const { rows } = await db.query("SELECT quantity FROM cart_items WHERE id = $1", [id]);
    if (rows.length === 0) return res.status(404).json({ error: "Item not found" });

    if (rows[0].quantity > 1) {
        await db.query("UPDATE cart_items SET quantity = quantity - 1 WHERE id = $1", [id]);
        res.json({ message: "Quantity reduced", quantity: rows[0].quantity - 1 });
    } else {
        await db.query("DELETE FROM cart_items WHERE id = $1", [id]);
        res.json({ message: "Item removed", quantity: 0 });
    }
}));

// Delete Cart Item
app.delete('/api/cart/:id', asyncHandler(async (req, res) => {
    await db.query("DELETE FROM cart_items WHERE id = $1", [req.params.id]);
    res.json({ message: "Deleted" });
}));

// Clear cart
app.post('/api/cart/clear', asyncHandler(async (req, res) => {
    await db.query("DELETE FROM cart_items");
    res.json({ message: "Cart cleared" });
}));

// Get Cart Items
app.get('/api/cart', asyncHandler(async (req, res) => {
    const { rows } = await db.query("SELECT * FROM cart_items");
    res.json({ message: "success", data: rows });
}));

// Get Cart Count
app.get('/api/cart/count', asyncHandler(async (req, res) => {
    const { rows } = await db.query("SELECT sum(quantity) as count FROM cart_items");
    res.json({ count: parseInt(rows[0].count) || 0 });
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// Generic error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: "Something went wrong!" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
