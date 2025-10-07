import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';
import { useCart } from '../../../contexts/CartContext';
import { Link } from 'react-router-dom';

const BuyBox = ({ product }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart(product.id, 1); // Assuming quantity 1 for now
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4 h-fit sticky top-24">
      <div className="font-body">
        <span className="text-3xl font-bold text-primary">₹{product.price.toLocaleString('en-IN')}</span>
        {product.originalPrice && (
          <span className="ml-2 text-muted-foreground line-through">₹{product.originalPrice.toLocaleString('en-IN')}</span>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-primary">FREE delivery</span> Thursday, September 4. Order within <span className="text-accent">10 hrs 3 mins</span>.
      </p>

      <div className="flex items-center space-x-2">
        <Icon name="MapPin" size={16} className="text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Deliver to Rajesh - Bangalore 560001</span>
      </div>

      <div className="text-lg font-semibold text-success">
        In Stock
      </div>

      <div className="space-y-3">
        <Button
          size="lg"
          fullWidth
          className="bg-yellow-400 hover:bg-yellow-500 text-black"
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
        <Link to="/checkout" className="w-full block">
          <Button
            size="lg"
            fullWidth
            className="bg-orange-400 hover:bg-orange-500 text-black"
          >
            Buy Now
          </Button>
        </Link>
      </div>

      <div className="text-sm text-muted-foreground flex items-start space-x-2 pt-2">
        <Icon name="Lock" size={16} className="mt-0.5" />
        <span>Secure transaction</span>
      </div>

      <div className="text-sm text-muted-foreground">
        Sold by <span className="text-accent">REV-orbit</span> and Fulfilled by <span className="text-accent">REV-orbit</span>.
      </div>

      <hr className="border-border" />

      <Button variant="outline" fullWidth>
        Add to Wish List
      </Button>
    </div>
  );
};

export default BuyBox;
