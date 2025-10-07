import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SortingControls = ({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  resultsCount,
  onToggleFilters,
  onExportResults
}) => {
  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant', icon: 'Target' },
    { value: 'price-low', label: 'Price: Low to High', icon: 'ArrowUp' },
    { value: 'price-high', label: 'Price: High to Low', icon: 'ArrowDown' },
    { value: 'newest', label: 'Newest First', icon: 'Clock' },
    { value: 'rating', label: 'Highest Rated', icon: 'Star' },
    { value: 'popular', label: 'Most Popular', icon: 'TrendingUp' }
  ];

  const viewModes = [
    { value: 'grid', icon: 'Grid3X3', label: 'Grid View' },
    { value: 'list', icon: 'List', label: 'List View' }
  ];

  // Share filter handler
  const handleShareFilters = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url
      }).catch(() => {
        // fallback to clipboard if user cancels or not supported
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      });
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    } else {
      alert('Sharing not supported on this browser.');
    }
  };
  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-xl p-4 automotive-shadow">
      {/* Left Section - Results Count & Filter Toggle */}
      <div className="flex items-center space-x-4">
        <Button
          variant="outline"
          size="sm"
          iconName="Filter"
          iconPosition="left"
          onClick={onToggleFilters}
          className="lg:hidden"
        >
          Filters
        </Button>
        
        <div className="hidden sm:flex items-center space-x-2">
          <Icon name="Package" size={16} className="text-muted-foreground" />
          <span className="font-body text-sm text-primary">
            <span className="font-semibold">{resultsCount?.toLocaleString('en-IN')}</span> products found
          </span>
        </div>
      </div>
      {/* Right Section - Sorting & View Controls */}
      <div className="flex items-center space-x-4">
        {/* Sort Dropdown */}
        <div className="relative group">
          <Button
            variant="outline"
            size="sm"
            iconName="ArrowUpDown"
            iconPosition="left"
            className="min-w-[140px] justify-between"
          >
            <span className="hidden sm:inline">
              {sortOptions?.find(option => option?.value === sortBy)?.label || 'Sort by'}
            </span>
            <span className="sm:hidden">Sort</span>
            <Icon name="ChevronDown" size={16} className="ml-2" />
          </Button>
          
          {/* Dropdown Menu */}
          <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-xl automotive-shadow-lg z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible automotive-transition">
            <div className="p-2">
              {sortOptions?.map((option) => (
                <button
                  key={option?.value}
                  onClick={() => onSortChange(option?.value)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-2 rounded-lg automotive-transition text-left
                    ${sortBy === option?.value 
                      ? 'bg-accent text-white' :'text-primary hover:bg-muted'
                    }
                  `}
                >
                  <Icon 
                    name={option?.icon} 
                    size={16} 
                    className={sortBy === option?.value ? 'text-white' : 'text-muted-foreground'}
                  />
                  <span className="font-body text-sm">{option?.label}</span>
                  {sortBy === option?.value && (
                    <Icon name="Check" size={16} className="ml-auto text-white" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="hidden md:flex items-center bg-muted rounded-lg p-1">
          {viewModes?.map((mode) => (
            <button
              key={mode?.value}
              onClick={() => onViewModeChange(mode?.value)}
              className={`
                flex items-center justify-center w-8 h-8 rounded-md automotive-transition
                ${viewMode === mode?.value 
                  ? 'bg-accent text-white automotive-shadow' 
                  : 'text-muted-foreground hover:text-primary hover:bg-card'
                }
              `}
              title={mode?.label}
            >
              <Icon name={mode?.icon} size={16} />
            </button>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="hidden lg:flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Download"
            className="text-muted-foreground hover:text-primary"
            title="Export Results"
            onClick={onExportResults}
          />
          <Button
            variant="ghost"
            size="sm"
            iconName="Share2"
            className="text-muted-foreground hover:text-primary"
            title="Share Filters"
            onClick={handleShareFilters}
          />
        </div>
      </div>
    </div>
  );
};

export default SortingControls;