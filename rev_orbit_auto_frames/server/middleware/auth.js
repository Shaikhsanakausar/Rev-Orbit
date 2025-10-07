const supabase = require('../config/supabaseClient');

module.exports = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Authentication token not provided.' });
  }

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'An unexpected error occurred during authentication.' });
  }
};
