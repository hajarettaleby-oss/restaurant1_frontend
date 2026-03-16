import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, Star, Clock, ChefHat } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { menuAPI } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      // For now, we'll use localStorage to store favorites
      // In production, this would be an API call
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        // Fetch menu items that match the favorite IDs
        const response = await menuAPI.getAll();
        const favoriteItems = response.data.filter(item => 
          favoriteIds.includes(item.id)
        );
        setFavorites(favoriteItems);
      }
    } catch (error) {
      console.error('Error fetching favorites:', error);
      // Use mock data for demo
      setFavorites([
        {
          id: 1,
          name: 'Wagyu Beef Tenderloin',
          description: 'Premium A5 wagyu with truffle butter, roasted vegetables, and red wine reduction',
          price: 89.99,
          image: '/images/food/steak.png',
          category: 'Main Course',
          rating: 4.9,
          prepTime: '35 min'
        },
        {
          id: 2,
          name: 'Lobster Thermidor',
          description: 'Classic French preparation with cognac cream sauce and gruyère gratin',
          price: 75.00,
          image: '/images/food/salmon.png',
          category: 'Seafood',
          rating: 4.8,
          prepTime: '40 min'
        },
        {
          id: 3,
          name: 'Truffle Risotto',
          description: 'Arborio rice with black truffle, parmesan, and aged balsamic',
          price: 42.00,
          image: '/images/food/pasta.png',
          category: 'Main Course',
          rating: 4.7,
          prepTime: '25 min'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const removeFromFavorites = async (itemId) => {
    try {
      setRemovingId(itemId);
      // Update localStorage
      const storedFavorites = localStorage.getItem('favorites');
      if (storedFavorites) {
        const favoriteIds = JSON.parse(storedFavorites);
        const updatedIds = favoriteIds.filter(id => id !== itemId);
        localStorage.setItem('favorites', JSON.stringify(updatedIds));
      }
      // Update state
      setFavorites(prev => prev.filter(item => item.id !== itemId));
    } catch (error) {
      console.error('Error removing favorite:', error);
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">My Favorites</h1>
          <p className="text-muted-foreground mt-1">
            {favorites.length} {favorites.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ChefHat className="w-4 h-4" />
          Browse Menu
        </Link>
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="text-center py-16 bg-card rounded-xl border border-border">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
            <Heart className="w-10 h-10 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">No favorites yet</h2>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            Start exploring our menu and save your favorite dishes for quick access
          </p>
          <Link
            to="/menu"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Explore Menu
          </Link>
        </div>
      ) : (
        /* Favorites Grid */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((item) => (
            <div
              key={item.id}
              className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-background/90 backdrop-blur-sm text-xs font-medium rounded-full">
                    {item.category}
                  </span>
                </div>
                <button
                  onClick={() => removeFromFavorites(item.id)}
                  disabled={removingId === item.id}
                  className="absolute top-3 right-3 p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-destructive hover:text-destructive-foreground transition-colors disabled:opacity-50"
                  title="Remove from favorites"
                >
                  {removingId === item.id ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2 mb-2">
                  <h3 className="font-semibold text-foreground line-clamp-1">{item.name}</h3>
                  <div className="flex items-center gap-1 text-amber-500 shrink-0">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {item.description}
                </p>
                <div className="flex items-center gap-3 text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {item.prepTime}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-primary">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleAddToCart(item)}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      {favorites.length > 0 && (
        <div className="flex flex-wrap gap-4 pt-6 border-t border-border">
          <button
            onClick={() => favorites.forEach(item => handleAddToCart(item))}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            Add All to Cart
          </button>
          <button
            onClick={() => {
              localStorage.removeItem('favorites');
              setFavorites([]);
            }}
            className="inline-flex items-center gap-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Clear All Favorites
          </button>
        </div>
      )}
    </div>
  );
}
