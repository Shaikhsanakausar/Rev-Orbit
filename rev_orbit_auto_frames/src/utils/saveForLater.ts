import { supabase } from '../utils/supabaseClient';

export async function saveProductForLater(product) {
  const userId = product.user_id || null;
  if (!userId) {
    // fallback to localStorage if not logged in
    const saved = JSON.parse(localStorage.getItem('wishlist') || '[]');
    if (saved.some(p => p.id === product.id)) {
      return { error: 'Already saved' };
    }
    saved.push(product);
    localStorage.setItem('wishlist', JSON.stringify(saved));
    return { error: null };
  }
  // Upsert into Supabase (no duplicate error)
  const { error } = await supabase
    .from('wishlist')
    .upsert(
      [{ user_id: userId, product_id: product.id }],
      { onConflict: 'user_id,product_id' }
    );
  if (error) {
    // Show a friendly error if upsert fails
    console.error('Supabase wishlist upsert error:', error);
    return { error: error.message || 'Could not add to wishlist. Please try again.' };
  }
  return { error: null };
}
