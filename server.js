// Basic server setup using Node.js and Express
const express = require('express');
const mysql = require('mysql');
const stripe = require('stripe')('your-stripe-secret-key');
const cors = require('cors');
const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// MySQL Database Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'delivery_db'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed: ' + err.stack);
        return;
    }
    console.log('Connected to MySQL database.');
});

// User Registration Endpoint
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    db.query('INSERT INTO users (username, email, password) VALUES (?, ?, ?)', 
        [username, email, password], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'User registered successfully' });
    });
});

// User Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ? AND password = ?', 
        [email, password], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        if (results.length > 0) {
            res.json({ message: 'Login successful', user: results[0] });
        } else {
            res.status(401).json({ message: 'Invalid credentials' });
        }
    });
});

// Order Placement Endpoint
app.post('/order', (req, res) => {
    const { user_id, items, total_price } = req.body;
    db.query('INSERT INTO orders (user_id, items, total_price, status) VALUES (?, ?, ?, "Pending")', 
        [user_id, JSON.stringify(items), total_price], (err, result) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Order placed successfully', orderId: result.insertId });
    });
});

// Order History Endpoint
app.get('/orders/:user_id', (req, res) => {
    const { user_id } = req.params;
    db.query('SELECT * FROM orders WHERE user_id = ?', [user_id], (err, results) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ orders: results });
    });
});

// Payment Processing via Stripe
app.post('/pay', async (req, res) => {
    try {
        const { amount, token } = req.body;
        const charge = await stripe.charges.create({
            amount: amount * 100, // Convert to cents
            currency: 'usd',
            source: token,
            description: 'Delivery Order Payment'
        });
        res.json({ success: true, charge });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Order Status Update Notification
app.post('/update-status', (req, res) => {
    const { order_id, status } = req.body;
    db.query('UPDATE orders SET status = ? WHERE id = ?', [status, order_id], (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: 'Order status updated' });
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});