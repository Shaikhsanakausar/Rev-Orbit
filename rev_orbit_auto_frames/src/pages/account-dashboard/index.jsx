import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import OrderCard from './components/OrderCard';
import DesignHistoryCard from './components/DesignHistoryCard';
import WishlistCard from './components/WishlistCard';
import LoyaltySection from './components/LoyaltySection';
import RecommendationCard from './components/RecommendationCard';
import AccountSettings from './components/AccountSettings';
import { useAuth } from '../../contexts/AuthContext';
import { ADMIN_EMAIL } from '../../utils/constants';
import { supabase } from '../../utils/supabaseClient';
import AccountOrders from './components/AccountOrders';

// Custom hook for real-time per-user table sync
function useRealtimeUserTable(table, userId, single = false, select = '*', extra = {}) {
  const [data, setData] = useState(single ? null : []);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    if (!userId) {
      setData(single ? null : []);
      setLoading(false);
      return;
    }
    try {
      let query = supabase.from(table).select(select).eq(extra.col || 'user_id', userId);
      if (single) query = query.single();
      const { data: d, error: e, status } = await query;
      if (e && e.code !== 'PGRST116') {
        setError(e);
        console.error(`Supabase ${table} error:`, e);
      } else {
        setError(null);
      }
      setData(d || (single ? null : []));
    } catch (err) {
      setError(err);
      setData(single ? null : []);
      console.error(`Supabase ${table} fetch exception:`, err);
    } finally {
      setLoading(false);
    }
  }, [table, userId, single, select, extra.col]);

  useEffect(() => {
    fetchData();
    if (!userId) return;
    const sub = supabase
      .channel(`public:${table}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table, filter: `${extra.col || 'user_id'}=eq.${userId}` },
        () => fetchData()
      )
      .subscribe();
    return () => { supabase.removeChannel(sub); };
  }, [fetchData, table, userId, extra.col]);

  return { data, loading, error };
}

const AccountDashboard = () => {
  const { user, session } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');

  // Profile
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setProfile(null);
      setLoadingProfile(false);
      return;
    }
    setLoadingProfile(true);
    setProfileError(null);
    (async () => {
      try {
        const { data, error, status } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();
        if (error || status === 406) {
          setProfile(null);
          setProfileError(error || { message: '406 Not Acceptable', status });
          console.error('Supabase users fetch error:', error, data);
        } else {
          setProfile(data);
        }
      } catch (err) {
        setProfile(null);
        setProfileError(err);
        console.error('Supabase users fetch exception:', err);
      } finally {
        setLoadingProfile(false);
      }
    })();
  }, [user?.id]);

  // Wishlist (fetch as callback so it can be called from handlers & subscriptions)
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true);
  const [wishlistError, setWishlistError] = useState(null);

  const fetchWishlist = useCallback(async () => {
    if (!user?.id) {
      setWishlistError('User not logged in or user.id missing');
      setWishlistItems([]);
      setLoadingWishlist(false);
      return;
    }
    setLoadingWishlist(true);
    setWishlistError(null);
    try {
      const { data, error, status } = await supabase
        .from('wishlist')
        .select('id, product_id, product:product_id (id, name, price, image_url, rating)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error || status === 406) {
        setWishlistItems([]);
        setWishlistError(error || { message: '406 Not Acceptable', status });
        console.error('Supabase wishlist fetch error:', error, data);
      } else {
        const arr = Array.isArray(data) ? data : (data ? [data] : []);
        const mapped = arr.map(item => {
          const product = item?.product || {};
          return {
            id: item?.id,
            product_id: item?.product_id,
            name: product?.name || 'Product',
            price: product?.price ?? 0,
            image_url: product?.image_url || '/assets/images/no_image.png',
            rating: product?.rating ?? 0,
          };
        }).filter(item => item.id && item.product_id);
        setWishlistItems(mapped);
      }
    } catch (err) {
      setWishlistItems([]);
      setWishlistError(err);
      console.error('Supabase wishlist fetch exception:', err);
    } finally {
      setLoadingWishlist(false);
    }
  }, [user?.id]);

  useEffect(() => {
    // initial fetch
    fetchWishlist();
    if (!user?.id) return;
    const channel = supabase
      .channel('public:wishlist')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'wishlist', filter: `user_id=eq.${user.id}` }, () => fetchWishlist())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [fetchWishlist, user?.id]);

  const { data: designHistory = [], loading: loadingDesigns } = useRealtimeUserTable('designs', user?.id);
  // Fetch orders with order items and product details
  const [ordersData, setOrdersData] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoadingOrders(true);
    supabase
      .from('orders')
      .select('id, status, created_at, order_item:order_item(id, quantity, price, product:product_id(id, name, image_url))')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .then(({ data, error }) => {
        setOrdersData(data || []);
        setLoadingOrders(false);
      });
  }, [user?.id]);
  const { data: recommendations = [], loading: loadingRecommendations } = useRealtimeUserTable('recommendations', user?.id);

  // Loyalty
  const [loyaltyData, setLoyaltyData] = useState(null);
  const [loadingLoyalty, setLoadingLoyalty] = useState(true);
  const [loyaltyError, setLoyaltyError] = useState(null);

  useEffect(() => {
    if (!user?.id) {
      setLoyaltyData(null);
      setLoadingLoyalty(false);
      return;
    }
    setLoadingLoyalty(true);
    setLoyaltyError(null);
    (async () => {
      try {
        const { data, error, status } = await supabase
          .from('loyalty')
          .select('*')
          .eq('user_id', user.id)
          .single();
        if (error || status === 406) {
          setLoyaltyData(null);
          setLoyaltyError(error || { message: '406 Not Acceptable', status });
          console.error('Supabase loyalty fetch error:', error, data);
        } else {
          setLoyaltyData(data);
        }
      } catch (err) {
        setLoyaltyData(null);
        setLoyaltyError(err);
        console.error('Supabase loyalty fetch exception:', err);
      } finally {
        setLoadingLoyalty(false);
      }
    })();
  }, [user?.id]);

  const loading = loadingProfile || loadingWishlist || loadingDesigns || loadingOrders || loadingLoyalty || loadingRecommendations;

  const isAdmin = ((user?.email || '').toLowerCase() === (ADMIN_EMAIL || '').toLowerCase());

  const handleRemoveFromWishlist = async (itemId) => {
    try {
      // Try to delete by id first
      let { error } = await supabase.from('wishlist').delete().eq('id', itemId);
      // If not deleted, try by product_id
      if (error || !itemId || typeof itemId !== 'number') {
        // Try by product_id (for cases where product_id is passed)
        const { error: error2 } = await supabase.from('wishlist').delete().eq('product_id', itemId).eq('user_id', user.id);
        error = error2;
      }
      if (!error) {
        setWishlistItems(prev => prev.filter(item => item.id !== itemId && item.product_id !== itemId));
        await fetchWishlist();
      } else {
        console.error('Error removing from wishlist:', error);
        alert('Error removing from wishlist');
      }
    } catch (err) {
      console.error('Exception removing from wishlist:', err);
      alert('Error removing from wishlist');
    }
  };

  const handleEditVehicle = (vehicle) => { /* ... */ };
  const handleCreateFrame = (vehicle) => { /* ... */ };
  const handleSaveProfile = async (updatedProfile) => { /* ... */ };

  const tabs = [
    { id: 'home', name: 'Home', icon: 'Home' },
    { id: 'overview', name: 'Overview', icon: 'User' },
    { id: 'orders', name: 'Orders', icon: 'Package' },
    { id: 'designs', name: 'Designs', icon: 'Scissors' },
    { id: 'wishlist', name: 'Wishlist', icon: 'Heart' },
    { id: 'loyalty', name: 'Loyalty', icon: 'Star' },
    { id: 'settings', name: 'Settings', icon: 'Settings' },
    ...(isAdmin ? [{ id: 'admin', name: 'Admin', icon: 'BarChart3' }] : []),
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="flex flex-col items-center justify-center h-full py-24">
            <Icon name="Home" size={64} className="text-accent mb-6 animate-pulse" />
            <h2 className="font-headline font-bold text-3xl mb-4 text-primary">Welcome to your Account</h2>
            <p className="text-muted-foreground text-lg mb-8">Quickly access your account features from the sidebar.</p>
          </div>
        );
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-headline font-bold text-2xl mb-2">
                    {loadingProfile ? 'Loading...' : profileError ? 'Welcome to your Account' : `Welcome back, ${profile?.name || profile?.email || 'User'}!`}
                  </h2>
                  <p className="text-white/80">
                    {profile?.join_date ? `Member since ${new Date(profile.join_date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` : ''}
                  </p>
                  {profileError && (
                    <div className="text-warning text-sm mt-2">Quickly access your account features from the sidebar</div>
                  )}
                </div>
                <div className="hidden md:block">
                  <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                    <Icon name="User" size={40} color="white" />
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border border-border rounded-lg p-6 text-center automotive-shadow">
                <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Package" size={24} className="text-accent" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{(ordersData ?? []).length ?? 0}</div>
                <div className="text-sm text-muted-foreground">Total Orders</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center automotive-shadow">
                <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="History" size={24} className="text-success" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{(designHistory ?? []).length ?? 0}</div>
                <div className="text-sm text-muted-foreground">Saved Designs</div>
              </div>
              <div className="bg-card border border-border rounded-lg p-6 text-center automotive-shadow">
                <div className="w-12 h-12 bg-warning/10 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Heart" size={24} className="text-warning" />
                </div>
                <div className="text-2xl font-bold text-primary mb-1">{(wishlistItems ?? []).length ?? 0}</div>
                <div className="text-sm text-muted-foreground">Wishlist Items</div>
              </div>
            </div>
          </div>
        );
      case 'orders':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-2xl text-primary">Order History</h2>
              <div className="flex items-center space-x-3">
                <Button variant="outline" size="sm" iconName="Filter" iconPosition="left">Filter</Button>
                <Button variant="outline" size="sm" iconName="Download" iconPosition="left">Export</Button>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {(ordersData ?? []).map(order => (
                order.order_item.map(item => (
                  <OrderCard
                    key={item.id}
                    order={{
                      orderNumber: order.id,
                      orderDate: new Date(order.created_at).toLocaleDateString(),
                      status: order.status,
                      productImage: item.product?.image_url,
                      productName: item.product?.name,
                      amount: item.price,
                      // Add more fields as needed
                    }}
                  />
                ))
              ))}
            </div>
          </div>
        );
      case 'designs':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-2xl text-primary">Design History</h2>
              <Link to="/customization-studio">
                <Button variant="default" size="sm" iconName="Plus" iconPosition="left">Create New Design</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {(designHistory ?? []).map(design => (
                <DesignHistoryCard key={design?.id} design={design} />
              ))}
            </div>
          </div>
        );
      case 'wishlist':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-headline font-bold text-2xl text-primary">My Wishlist</h2>
              <Link to="/product-catalog">
                <Button variant="outline" size="sm" iconName="Plus" iconPosition="left">Browse Products</Button>
              </Link>
            </div>
            {loadingWishlist ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : wishlistError ? (
              <div className="text-center py-12 text-warning">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertTriangle" size={48} className="text-warning" />
                </div>
                <h3 className="font-headline font-semibold text-lg text-primary mb-2">Could not load wishlist</h3>
                <p className="text-muted-foreground mb-6">{wishlistError?.message || wishlistError?.toString() || 'An error occurred.'}</p>
                <Link to="/product-catalog">
                  <Button variant="default" iconName="Plus" iconPosition="left">Browse Products</Button>
                </Link>
              </div>
            ) : (wishlistItems?.length > 0) ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(wishlistItems ?? []).map(item => (
                  <WishlistCard key={item?.id} item={item} onRemove={handleRemoveFromWishlist} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="Heart" size={48} className="text-muted-foreground" />
                </div>
                <h3 className="font-headline font-semibold text-lg text-primary mb-2">Your wishlist is empty</h3>
                <p className="text-muted-foreground mb-6">Start adding products you love to keep track of them</p>
                <Link to="/product-catalog">
                  <Button variant="default" iconName="Plus" iconPosition="left">Browse Products</Button>
                </Link>
              </div>
            )}
          </div>
        );
      case 'loyalty':
        return (
          <div className="space-y-8">
            <h2 className="font-headline font-bold text-2xl text-primary">Loyalty Program</h2>
            {loadingLoyalty ? (
              <div className="text-center py-12 text-muted-foreground">Loading...</div>
            ) : loyaltyError ? (
              <div className="text-center py-12 text-warning">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name="AlertTriangle" size={48} className="text-warning" />
                </div>
                <h3 className="font-headline font-semibold text-lg text-primary mb-2">Could not load loyalty data</h3>
                <p className="text-muted-foreground mb-6">{loyaltyError?.message || loyaltyError?.toString() || 'An error occurred.'}</p>
              </div>
            ) : (
              <>
                <LoyaltySection loyaltyData={loyaltyData} />
                <div className="bg-card border border-border rounded-lg p-6 automotive-shadow">
                  <h3 className="font-headline font-bold text-xl text-primary mb-4">Refer Friends</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-muted-foreground mb-4">Share REV-orbit with friends and earn 500 points for each successful referral!</p>
                      <div className="bg-muted rounded-lg p-4 mb-4">
                        <p className="text-sm text-muted-foreground mb-2">Your referral code:</p>
                        <div className="flex items-center space-x-2">
                          <code className="bg-background px-3 py-2 rounded font-mono text-primary">RAJESH2024</code>
                          <Button variant="outline" size="sm" iconName="Copy">Copy</Button>
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent mb-2">{loyaltyData?.referrals ?? 0}</div>
                      <div className="text-muted-foreground">Successful Referrals</div>
                      <div className="text-sm text-success mt-2">Earned {(loyaltyData?.referrals ?? 0) * 500} points</div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        );
      case 'settings':
        return (
          <div className="space-y-6">
            <h2 className="font-headline font-bold text-2xl text-primary">Account Settings</h2>
            <AccountSettings userProfile={profile} onSave={handleSaveProfile} />
          </div>
        );
      case 'admin':
        return (
          <div className="flex flex-col items-center justify-center h-full py-24">
            <Icon name="BarChart3" size={64} className="text-orange-500 mb-6 animate-pulse" />
            <h2 className="font-headline font-bold text-3xl mb-4 text-primary">Admin Dashboard</h2>
            <p className="text-muted-foreground text-lg mb-8">Access all admin features here.</p>
            <Link to="/admin">
              <Button variant="primary" size="lg" iconName="ArrowRight" iconPosition="right">Go to Admin Dashboard</Button>
            </Link>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="lg:hidden mb-6">
            <div className="flex overflow-x-auto space-x-1 pb-2">
              {tabs?.map(tab => (
                <button
                  key={tab?.id}
                  onClick={() => setActiveTab(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium whitespace-nowrap automotive-transition ${
                    activeTab === tab?.id ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={18} />
                  <span>{tab?.name}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            <div className="hidden lg:block w-64 flex-shrink-0">
              <div className="bg-card border border-border rounded-lg p-4 automotive-shadow sticky top-24">
                <nav className="space-y-2">
                  {tabs?.map(tab => (
                    <button
                      key={tab?.id}
                      onClick={() => setActiveTab(tab?.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium text-left automotive-transition ${
                        activeTab === tab?.id ? 'bg-orange-500 text-white shadow-lg' : 'text-muted-foreground hover:text-orange-500 hover:bg-orange-100'
                      }`}
                    >
                      <Icon name={tab?.icon} size={20} />
                      <span>{tab?.name}</span>
                    </button>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-border">
                  <h4 className="font-headline font-semibold text-sm text-primary mb-3">Quick Actions</h4>
                  <div className="space-y-2">
                    <Link to="/customization-studio">
                      <Button variant="outline" size="sm" iconName="Palette" iconPosition="left" className="w-full justify-start">Create Design</Button>
                    </Link>
                    <Link to="/product-catalog">
                      <Button variant="outline" size="sm" iconName="Grid3X3" iconPosition="left" className="w-full justify-start">Browse Catalog</Button>
                    </Link>
                    <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left" className="w-full justify-start">Contact Support</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              {renderTabContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountDashboard;
