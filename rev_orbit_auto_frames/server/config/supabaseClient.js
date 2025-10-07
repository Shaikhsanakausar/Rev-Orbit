require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

// Add ADMIN_EMAIL to your .env file for admin checks

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;
