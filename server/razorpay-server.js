const express = require('express');
const Razorpay = require('razorpay');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const razorpay = new Razorpay({
  key_id: 'rzp_test_DERPySnzT1pLOT',
  key_secret: 'YOUR_TEST_SECRET', // Replace with your Razorpay test secret
});

app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt } = req.body;
    const options = {
      amount: amount * 100, // amount in paise
      currency,
      receipt: receipt || `rcptid_${Date.now()}`,
    };
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create Razorpay order', details: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
