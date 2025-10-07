const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const apiRoutes = require('./routes/api');
const cartRoutes = require('./routes/cart');
const path = require('path');
require('dotenv').config();

app.use('/images', express.static(path.join(__dirname, 'public/images')));

app.use(express.json());

// Use api routes
app.use('/api', apiRoutes);
app.use('/api/cart', cartRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
