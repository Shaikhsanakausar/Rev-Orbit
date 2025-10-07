import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

// ✅ Import your logo
import logo from '../../assets/vintage-logo.png';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const { cartCount } = useCart();

  const navigationItems = [
    { name: 'Home', path: '/homepage', icon: 'Home' },
    { name: 'Product', path: '/product-catalog', icon: 'Grid3X3' },
    { name: 'Studio', path: '/customization-studio', icon: 'Palette' },
    { name: 'Account', path: '/account-dashboard', icon: 'User', private: true }
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const handleLogout = async () => {
    await signOut();
    setIsMobileMenuOpen(false);
  };

  const visibleNavItems = navigationItems.filter(item => !item.private || (item.private && user));

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-automotive border-b border-border automotive-shadow">
      <div className="w-full">
        <div className="flex items-center justify-between h-16 px-4 lg:px-6">
          {/* ✅ Logo */}
          <Link to="/homepage" className="flex items-center space-x-3 hover:opacity-80 automotive-transition">
            <div className="w-10 h-10 rounded-lg overflow-hidden automotive-shadow">
              <img 
                src={logo} 
                alt="REV-orbit Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
            <div className="hidden sm:block">
              <h1 className="font-headline font-bold text-xl text-primary">REV-orbit</h1>
              <p className="font-body text-xs text-muted-foreground -mt-1">Auto Frames</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {visibleNavItems.map((item) => (
              <Link
                key={item?.path}
                to={item?.path}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-body font-medium automotive-transition ${
                  isActivePath(item?.path)
                    ? 'bg-accent text-accent-foreground automotive-shadow'
                    : 'text-muted-foreground hover:text-primary hover:bg-muted'
                }`}
              >
                <Icon name={item?.icon} size={18} />
                <span>{item?.name}</span>
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center space-x-3">
            {user ? (
              <>
                <span className="text-sm text-muted-foreground">Welcome, {user.email.split('@')[0]}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="text-muted-foreground hover:text-primary"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-primary"
                  >
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    variant="default"
                    size="sm"
                    className="bg-racing-red hover:bg-racing-red/90 text-white"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
            <Link to="/checkout">
              <Button
                variant="default"
                size="sm"
                iconName="ShoppingCart"
                iconPosition="left"
                className="bg-accent hover:bg-accent/90 text-white"
              >
                Cart ({user ? cartCount : 0})
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            iconName={isMobileMenuOpen ? "X" : "Menu"}
            onClick={toggleMobileMenu}
            className="lg:hidden"
          />
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border automotive-shadow-lg">
            <nav className="px-4 py-4 space-y-2">
              {visibleNavItems.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg font-body font-medium automotive-transition ${
                    isActivePath(item?.path)
                      ? 'bg-accent text-accent-foreground automotive-shadow'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={20} />
                  <span>{item?.name}</span>
                </Link>
              ))}
              <div className="pt-4 border-t border-border mt-4">
                {user ? (
                  <Button
                    onClick={handleLogout}
                    className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-red-600 text-white rounded-lg font-body font-medium automotive-transition hover:bg-red-700"
                  >
                    <Icon name="LogOut" size={20} />
                    <span>Logout</span>
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-600 text-white rounded-lg font-body font-medium automotive-transition hover:bg-gray-700"
                    >
                      <span>Login</span>
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center space-x-2 w-full px-4 py-3 bg-racing-red text-white rounded-lg font-body font-medium automotive-transition hover:bg-racing-red/90"
                    >
                      <span>Sign Up</span>
                    </Link>
                  </div>
                )}
                <Link
                  to="/checkout"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="mt-2 flex items-center justify-center space-x-2 w-full px-4 py-3 bg-accent text-white rounded-lg font-body font-medium automotive-transition hover:bg-accent/90"
                >
                  <Icon name="ShoppingCart" size={20} />
                  <span>Checkout</span>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
