const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const auth = require('../middleware/auth');

// @route   GET api/admin/orders
// @desc    Get all orders (admin only)
// @access  Private
router.get('/admin/orders', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*');
        if (error) throw error;
        res.json(Array.isArray(data) ? data : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT api/orders/:id/status
// @desc    Update order status (admin only)
// @access  Private
router.put('/orders/:id/status', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    const { id } = req.params;
    const { status } = req.body;
    if (!status) return res.status(400).json({ error: 'Status is required.' });
    try {
        const { data, error } = await supabase
            .from('orders')
            .update({ status })
            .eq('id', id)
            .select('*')
            .single();
        if (error) throw error;
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/admin/users
// @desc    Get all users (admin only)
// @access  Private
router.get('/admin/users', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    try {
        // Supabase Auth users fetch (example, adjust as needed)
        const { data, error } = await supabase.auth.admin.listUsers();
        if (error) throw error;
        res.json(Array.isArray(data?.users) ? data.users : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/admin/inventory/low-stock
// @desc    Get low-stock products (admin only)
// @access  Private
router.get('/admin/inventory/low-stock', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .lt('stock_quantity', 10); // threshold for low stock
        if (error) throw error;
        res.json(Array.isArray(data) ? data : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT api/admin/inventory/:id/stock
// @desc    Update stock quantity (admin only)
// @access  Private
router.put('/admin/inventory/:id/stock', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    const { id } = req.params;
    const { stock_quantity } = req.body;
    if (typeof stock_quantity !== 'number') return res.status(400).json({ error: 'stock_quantity is required.' });
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ stock_quantity })
            .eq('id', id)
            .select('*')
            .single();
        if (error) throw error;
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/admin/analytics/summary
// @desc    Get analytics summary (admin only)
// @access  Private
router.get('/admin/analytics/summary', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    try {
        // Total sales
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total_price');
        if (ordersError) throw ordersError;
        const totalSales = orders.reduce((sum, o) => sum + (o.total_price || 0), 0);
        // Total orders
        const totalOrders = orders.length;
        // Most sold products (example: count by product_id)
        const { data: orderItems, error: itemsError } = await supabase
            .from('order_items')
            .select('product_id, quantity');
        if (itemsError) throw itemsError;
        const productSales = {};
        orderItems.forEach(item => {
            productSales[item.product_id] = (productSales[item.product_id] || 0) + (item.quantity || 0);
        });
        const mostSold = Object.entries(productSales)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([product_id, quantity]) => ({ product_id, quantity }));
        res.json({ totalSales, totalOrders, mostSold });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// @route   GET api/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'API is working' }));

// Helper: Check if user is admin
const isAdmin = (user) => user && user.email && user.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

// @route   GET api/products
// @desc    Get all products
// @access  Public
router.get('/products', async (req, res) => {
// @route   POST api/products
// @desc    Add a new product (admin only)
// @access  Private
router.post('/products', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    const { name, description, price, category, stock_quantity, image_url } = req.body;
    if (!name || !price) return res.status(400).json({ error: 'Name and price are required.' });
    try {
        const { data, error } = await supabase
            .from('products')
            .insert([{ name, description, price, category, stock_quantity, image_url }])
            .select('*')
            .single();
        if (error) throw error;
        res.status(201).json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   PUT api/products/:id
// @desc    Update a product (admin only)
// @access  Private
router.put('/products/:id', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    const { id } = req.params;
    const { name, description, price, category, stock_quantity, image_url } = req.body;
    try {
        const { data, error } = await supabase
            .from('products')
            .update({ name, description, price, category, stock_quantity, image_url })
            .eq('id', id)
            .select('*')
            .single();
        if (error) throw error;
        res.json(data || {});
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   DELETE api/products/:id
// @desc    Delete a product (admin only)
// @access  Private
router.delete('/products/:id', auth, async (req, res) => {
    if (!isAdmin(req.user)) return res.status(403).json({ error: 'Not authorized' });
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);
        if (error) throw error;
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*');
        if (error) throw error;
        // If product has image_url, use it, else fallback to static
        const imageBaseUrl = `${req.protocol}://${req.get('host')}/images`;
        const productImages = [
            `${imageBaseUrl}/product-1.jpeg`,
            `${imageBaseUrl}/product-2.jpeg`,
            `${imageBaseUrl}/product-3.jpeg`,
            `${imageBaseUrl}/product-4.jpeg`,
            `${imageBaseUrl}/product-5.jpeg`,
        ];
        const productsWithImages = (data || []).map((product, index) => ({
            ...product,
            image_url: product.image_url || productImages[index % productImages.length],
            gallery_urls: [
                productImages[(index + 1) % productImages.length],
                productImages[(index + 2) % productImages.length],
                productImages[(index + 3) % productImages.length],
            ]
        }));
        res.json(productsWithImages);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// @route   GET api/orders
// @desc    Get orders for a user
// @access  Private
router.get('/orders', auth, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', req.user.id);

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
