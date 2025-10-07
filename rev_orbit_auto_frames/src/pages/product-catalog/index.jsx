import React, { useState, useEffect } from 'react';
import axios from 'axios';

import Header from '../../components/ui/Header';
import BannerTextMarquee from '../../components/ui/BannerTextMarquee.jsx';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import SortingControls from './components/SortingControls';
import ProductCard from './components/ProductCard';
import QuickPreviewModal from './components/QuickPreviewModal';
import ComparisonPanel from './components/ComparisonPanel';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    carType: [],
    era: [],
    frameStyle: [],
    priceRange: []
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('relevance');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterSidebarOpen, setIsFilterSidebarOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [comparisonProducts, setComparisonProducts] = useState([]);
  const [isComparisonPanelOpen, setIsComparisonPanelOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('/api/products');
        setProducts(response.data);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Mock product data
  const mockProducts = [];

  const handleFilterChange = (category, values) => {
    setFilters(prev => ({
      ...prev,
      [category]: values
    }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({
      carType: [],
      era: [],
      frameStyle: [],
      priceRange: []
    });
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleVisualSearch = (file) => {
    // Mock visual search functionality
    console.log('Visual search with file:', file?.name);
    setSearchQuery('Visual search results');
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    setCurrentPage(1);
  };

  const handleQuickPreview = (product) => {
    setSelectedProduct(product);
    setIsPreviewModalOpen(true);
  };

  const handleAddToCompare = (product) => {
    if (comparisonProducts?.length < 3 && !comparisonProducts?.find(p => p?.id === product?.id)) {
      setComparisonProducts(prev => [...prev, product]);
    }
  };

  const handleRemoveFromCompare = (productId) => {
    setComparisonProducts(prev => prev?.filter(p => p?.id !== productId));
  };

  const handleClearComparison = () => {
    setComparisonProducts([]);
    setIsComparisonPanelOpen(false);
  };

  const toggleFilterSidebar = () => {
    setIsFilterSidebarOpen(!isFilterSidebarOpen);
  };

  const toggleComparisonPanel = () => {
    setIsComparisonPanelOpen(!isComparisonPanelOpen);
  };

  // Filter and sort products
  const filteredProducts = products?.filter(product => {
    // Search filter
    if (searchQuery) {
      const searchLower = searchQuery?.toLowerCase();
      const matchesSearch = 
        product?.name?.toLowerCase()?.includes(searchLower) ||
        product?.category?.toLowerCase()?.includes(searchLower) ||
        product?.tags?.some(tag => tag?.toLowerCase()?.includes(searchLower)) ||
        product?.description?.toLowerCase()?.includes(searchLower);
      
      if (!matchesSearch) return false;
    }

    // Category filters (assuming tags now hold this info)
    if (filters?.carType?.length > 0) {
      const hasMatchingCarType = filters?.carType?.some(type => 
        product?.tags?.includes(type)
      );
      if (!hasMatchingCarType) return false;
    }

    // Frame style filters (assuming tags now hold this info)
    if (filters?.frameStyle?.length > 0) {
      const hasMatchingStyle = filters?.frameStyle?.some(style => 
        product?.tags?.includes(style)
      );
      if (!hasMatchingStyle) return false;
    }

    // Price range filters
    if (filters?.priceRange?.length > 0) {
      const hasMatchingPrice = filters?.priceRange?.some(range => {
        const price = product?.price || 0;
        switch (range) {
          case '0-5000': return price < 5000;
          case '5000-10000': return price >= 5000 && price < 10000;
          case '10000-20000': return price >= 10000 && price < 20000;
          case '20000-50000': return price >= 20000 && price < 50000;
          case '50000+': return price >= 50000;
          default: return false;
        }
      });
      if (!hasMatchingPrice) return false;
    }

    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts]?.sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a?.price - b?.price;
      case 'price-high':
        return b?.price - a?.price;
      case 'rating':
        return b?.rating - a?.rating;
      case 'newest':
        return b?.isNew - a?.isNew;
      case 'popular':
        return b?.isBestseller - a?.isBestseller;
      default:
        return 0;
    }
  });

  const resultsCount = sortedProducts?.length;
  const productsPerPage = 12;
  const totalPages = Math.ceil(resultsCount / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = sortedProducts?.slice(startIndex, startIndex + productsPerPage);

  useEffect(() => {
    // Close filter sidebar on desktop
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsFilterSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col">
  {/* Navbar removed as per user request */}
      <Header />
  {/* Spacer for fixed header and search bar height (h-32) */}
  <div className="w-full h-32" />
  {/* Top search bar: visually prominent, sticky, with shadow, always below header */}
  <div className="w-full px-4 pt-4 pb-4 bg-background sticky top-16 z-30 shadow-lg">
        <div className="max-w-3xl mx-auto">
          <SearchBar
            searchQuery={searchQuery}
            onSearchChange={handleSearchChange}
            onVisualSearch={handleVisualSearch}
          />
        </div>
      </div>
  <BannerTextMarquee />
      <div className="flex-1 flex flex-row w-full max-w-[1800px] mx-auto">
        {/* Sidebar: fixed width on desktop, collapses on mobile */}
        <div className="hidden lg:block w-72 min-w-[18rem] border-r border-border bg-muted/30 px-2 py-6">
          <FilterSidebar
            filters={filters}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            isOpen={isFilterSidebarOpen}
            onClose={() => setIsFilterSidebarOpen(false)}
          />
        </div>
        {/* Mobile sidebar toggle */}
        <div className="block lg:hidden w-full px-2 py-2">
          <Button variant="outline" size="sm" onClick={toggleFilterSidebar} className="mb-2 w-full">Filters</Button>
          {isFilterSidebarOpen && (
            <div className="bg-muted/30 rounded-xl p-2 mb-2">
              <FilterSidebar
                filters={filters}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
                isOpen={isFilterSidebarOpen}
                onClose={() => setIsFilterSidebarOpen(false)}
              />
            </div>
          )}
        </div>
  {/* Main Content: grid fills remaining space, extra top margin for sticky search bar, small left margin for sidebar */}
  <div className="flex-1 px-2 pt-8 pb-6 flex flex-col lg:ml-6">
          {/* Sorting controls and active filters */}
          <div className="flex flex-col gap-4 mb-4">
            <SortingControls
              sortBy={sortBy}
              onSortChange={handleSortChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              resultsCount={resultsCount}
              onToggleFilters={toggleFilterSidebar}
              onExportResults={() => {
                // Export displayedProducts as CSV
                if (!displayedProducts?.length) {
                  alert('No products to export.');
                  return;
                }
                const headers = ['ID', 'Name', 'Category', 'Price', 'Original Price', 'Rating', 'Description'];
                const rows = displayedProducts.map(p => [
                  p.id,
                  '"' + (p.name || '').replace(/"/g, '""') + '"',
                  '"' + (p.category || '').replace(/"/g, '""') + '"',
                  p.price,
                  p.original_price || '',
                  p.rating || '',
                  '"' + (p.description || '').replace(/"/g, '""') + '"'
                ]);
                const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
                const blob = new Blob([csv], { type: 'text/csv' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = 'products_export.csv';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
            />
            {(Object.values(filters)?.some(arr => arr?.length > 0) || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 p-4 bg-muted rounded-xl">
                <span className="text-sm font-medium text-primary">Active filters:</span>
                {searchQuery && (
                  <span className="flex items-center space-x-2 px-3 py-1 bg-accent text-white text-sm rounded-full">
                    <span>Search: "{searchQuery}"</span>
                    <button onClick={() => setSearchQuery('')}>
                      <Icon name="X" size={14} />
                    </button>
                  </span>
                )}
                {Object.entries(filters)?.map(([category, values]) =>
                  values?.map(value => (
                    <span
                      key={`${category}-${value}`}
                      className="flex items-center space-x-2 px-3 py-1 bg-card border border-border text-sm rounded-full"
                    >
                      <span>{value}</span>
                      <button
                        onClick={() => handleFilterChange(category, values?.filter(v => v !== value))}
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </span>
                  ))
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearFilters}
                  className="text-muted-foreground hover:text-primary ml-2"
                >
                  Clear all
                </Button>
              </div>
            )}
          </div>
          {/* Products grid: responsive, fills space, visually clean */}
          {error && (
            <div className="text-center py-16 text-red-500">
              <Icon name="AlertTriangle" size={48} className="mx-auto mb-4" />
              <h3 className="font-headline font-semibold text-xl mb-2">
                Something went wrong
              </h3>
              <p>{error}</p>
            </div>
          )}
          {isLoading ? (
            <div className={viewMode === 'list' ? 'flex flex-col gap-4 w-full' : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full'}>
              {[...Array(8)]?.map((_, index) => (
                <div key={index} className="bg-card rounded-xl border border-border overflow-hidden animate-pulse shadow-lg">
                  <div className="aspect-[4/3] bg-muted" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-6 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : displayedProducts?.length > 0 ? (
            viewMode === 'list' ? (
              <div className="flex flex-col gap-4 w-full">
                {displayedProducts?.map((product) => (
                  <div key={product?.id} className="bg-card rounded-xl border border-border overflow-hidden shadow-lg">
                    <ProductCard
                      product={product}
                      onQuickPreview={handleQuickPreview}
                      onAddToCompare={handleAddToCompare}
                      isComparing={comparisonProducts?.some(p => p?.id === product?.id)}
                      viewMode="list"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                {displayedProducts?.map((product) => (
                  <ProductCard
                    key={product?.id}
                    product={product}
                    onQuickPreview={handleQuickPreview}
                    onAddToCompare={handleAddToCompare}
                    isComparing={comparisonProducts?.some(p => p?.id === product?.id)}
                  />
                ))}
              </div>
            )
          ) : (
            <div className="text-center py-16">
              <Icon name="Search" size={48} className="text-muted-foreground mx-auto mb-4" />
              <h3 className="font-headline font-semibold text-xl text-primary mb-2">
                No products found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your filters or search terms to find what you're looking for
              </p>
              <Button
                variant="outline"
                onClick={handleClearFilters}
                className="hover:bg-accent hover:text-white hover:border-accent"
              >
                Clear all filters
              </Button>
            </div>
          )}
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-8">
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronLeft"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="hover:bg-accent hover:text-white hover:border-accent"
              >
                Previous
              </Button>
              <div className="flex items-center space-x-1">
                {[...Array(totalPages)]?.map((_, index) => {
                  const page = index + 1;
                  if (
                    page === 1 ||
                    page === totalPages ||
                    (page >= currentPage - 1 && page <= currentPage + 1)
                  ) {
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className={currentPage === page 
                          ? "bg-accent text-white" :"hover:bg-accent hover:text-white hover:border-accent"
                        }
                      >
                        {page}
                      </Button>
                    );
                  } else if (
                    page === currentPage - 2 ||
                    page === currentPage + 2
                  ) {
                    return <span key={page} className="text-muted-foreground">...</span>;
                  }
                  return null;
                })}
              </div>
              <Button
                variant="outline"
                size="sm"
                iconName="ChevronRight"
                iconPosition="right"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="hover:bg-accent hover:text-white hover:border-accent"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    {/* Quick Preview Modal */}
    <QuickPreviewModal
      product={selectedProduct}
      isOpen={isPreviewModalOpen}
      onClose={() => setIsPreviewModalOpen(false)}
      onAddToCompare={handleAddToCompare}
    />
    {/* Comparison Panel */}
    <ComparisonPanel
      products={comparisonProducts}
      onRemoveProduct={handleRemoveFromCompare}
      onClearAll={handleClearComparison}
      isOpen={isComparisonPanelOpen}
      onToggle={toggleComparisonPanel}
    />
    </div>
  );
};

export default ProductCatalog;