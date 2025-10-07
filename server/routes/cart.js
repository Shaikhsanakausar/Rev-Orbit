
const express = require('express');
const router = express.Router();
const supabase = require('../config/supabaseClient');
const authMiddleware = require('../middleware/auth');

// All cart routes are protected by the auth middleware
router.use(authMiddleware);

// PUT /api/cart/:cartRowId - Update quantity for a cart item
router.put('/:cartRowId', async (req, res) => {
  const { cartRowId } = req.params;
  const { quantity } = req.body;
  if (!quantity) {
    return res.status(400).json({ error: 'Quantity is required.' });
  }
  try {
    const { data, error } = await supabase
      .from('cart')
      .update({ quantity })
      .eq('user_id', req.user.id)
      .eq('id', cartRowId)
      .select('*, products(*)')
      .single();
    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/cart - Fetch the user's cart
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('cart')
      .select('*, products(*)')
      .eq('user_id', req.user.id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/cart - Add or update an item in the cart
router.post('/', async (req, res) => {
  const { product_id, quantity } = req.body;

  if (!product_id || !quantity) {
    return res.status(400).json({ error: 'Product ID and quantity are required.' });
  }

  try {
    // Check if the item is already in the cart
    const { data: existingItem, error: selectError } = await supabase
      .from('cart')
      .select('*')
      .eq('user_id', req.user.id)
      .eq('product_id', product_id)
      .single();

    if (selectError && selectError.code !== 'PGRST116') { // PGRST116: row not found
      console.error('Select error:', selectError);
      throw selectError;
    }

    if (existingItem) {
      // Update quantity
      const { data, error } = await supabase
        .from('cart')
        .update({ quantity: existingItem.quantity + quantity })
        .eq('id', existingItem.id)
        .select('*, products(*)')
        .single();
      
      if (error) {
        console.error('Update error:', error);
        throw error;
      }
      return res.json(data);
    } else {
      // Add new item
      const { data, error } = await supabase
        .from('cart')
        .insert({ user_id: req.user.id, product_id, quantity })
        .select('*, products(*)')
        .single();

      if (error) {
        console.error('Insert error:', error);
        throw error;
      }
      return res.status(201).json(data);
    }
  } catch (error) {
    console.error('Cart POST error:', error);
    res.status(500).json({ error: error.message, details: error });
  }
});

// DELETE /api/cart/:cartRowId - Remove an item from the cart by cart row id
router.delete('/:cartRowId', async (req, res) => {
  const { cartRowId } = req.params;

  try {
    const { error } = await supabase
      .from('cart')
      .delete()
      .eq('user_id', req.user.id)
      .eq('id', cartRowId);

    if (error) throw error;
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
