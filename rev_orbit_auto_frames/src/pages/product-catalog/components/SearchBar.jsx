import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SearchBar = ({ searchQuery, onSearchChange, onVisualSearch }) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const fileInputRef = useRef(null);

  const searchSuggestions = [
    { type: 'recent', text: 'Classic Ferrari frames', icon: 'Clock' },
    { type: 'recent', text: 'Shadow box for Mustang', icon: 'Clock' },
    { type: 'popular', text: 'Vintage car displays', icon: 'TrendingUp' },
    { type: 'popular', text: 'JDM car frames', icon: 'TrendingUp' },
    { type: 'category', text: 'Luxury car memorabilia', icon: 'Tag' },
    { type: 'category', text: 'Racing themed frames', icon: 'Tag' }
  ];

  const automotiveTerms = [
    'muscle car', 'classic car', 'vintage car', 'sports car', 'luxury car',
    'JDM', 'European classics', 'American muscle', 'racing legends',
    'Ferrari', 'Porsche', 'BMW', 'Mercedes', 'Audi', 'Lamborghini',
    'Mustang', 'Corvette', 'Camaro', 'Challenger'
  ];

  const handleSearchFocus = () => {
    setIsSearchFocused(true);
    setShowSuggestions(true);
  };

  const handleSearchBlur = () => {
    setIsSearchFocused(false);
    // Delay hiding suggestions to allow clicking
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion) => {
    onSearchChange(suggestion?.text);
    setShowSuggestions(false);
  };

  const handleVisualSearchClick = () => {
    fileInputRef?.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event?.target?.files?.[0];
    if (file) {
      onVisualSearch(file);
    }
  };

  const filteredSuggestions = searchQuery
    ? searchSuggestions?.filter(suggestion =>
        suggestion?.text?.toLowerCase()?.includes(searchQuery?.toLowerCase())
      )
    : searchSuggestions;

  return (
    <div className="relative">
      {/* Search Input Container */}
      <div className={`
        relative flex items-center bg-card border rounded-xl automotive-shadow
        ${isSearchFocused ? 'border-accent ring-2 ring-accent/20' : 'border-border'}
        automotive-transition
      `}>
        {/* Search Icon */}
        <div className="pl-4">
          <Icon name="Search" size={20} className="text-muted-foreground" />
        </div>

        {/* Search Input */}
        <input
          type="text"
          placeholder="Search by car model, frame style, or automotive terms..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e?.target?.value)}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          className="flex-1 px-4 py-3 bg-transparent text-primary placeholder-muted-foreground focus:outline-none font-body"
        />

        {/* Visual Search Button */}
        <div className="pr-2">
          <Button
            variant="ghost"
            size="sm"
            iconName="Camera"
            onClick={handleVisualSearchClick}
            className="text-muted-foreground hover:text-accent"
          />
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Clear Button */}
        {searchQuery && (
          <div className="pr-4">
            <button
              onClick={() => onSearchChange('')}
              className="text-muted-foreground hover:text-primary automotive-transition"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        )}
      </div>
      {/* Search Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl automotive-shadow-lg z-50 max-h-80 overflow-y-auto">
          {/* Quick Filters */}
          <div className="p-4 border-b border-border">
            <p className="text-xs font-medium text-muted-foreground mb-3">Quick Filters</p>
            <div className="flex flex-wrap gap-2">
              {['Classic Cars', 'Sports Cars', 'Luxury Frames', 'Shadow Boxes']?.map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleSuggestionClick({ text: filter })}
                  className="px-3 py-1 bg-muted text-primary text-sm rounded-full hover:bg-accent hover:text-white automotive-transition"
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Suggestions */}
          <div className="p-2">
            {filteredSuggestions?.length > 0 ? (
              filteredSuggestions?.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-muted automotive-transition text-left"
                >
                  <Icon 
                    name={suggestion?.icon} 
                    size={16} 
                    className={`
                      ${suggestion?.type === 'recent' ? 'text-muted-foreground' : ''}
                      ${suggestion?.type === 'popular' ? 'text-automotive-orange' : ''}
                      ${suggestion?.type === 'category' ? 'text-accent' : ''}
                    `}
                  />
                  <span className="font-body text-sm text-primary">{suggestion?.text}</span>
                  <span className="ml-auto text-xs text-muted-foreground capitalize">
                    {suggestion?.type}
                  </span>
                </button>
              ))
            ) : (
              <div className="px-3 py-4 text-center">
                <Icon name="Search" size={24} className="text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No suggestions found</p>
              </div>
            )}
          </div>

          {/* Automotive Terms Help */}
          <div className="p-4 border-t border-border bg-muted/30">
            <p className="text-xs font-medium text-muted-foreground mb-2">Try searching for:</p>
            <div className="flex flex-wrap gap-1">
              {automotiveTerms?.slice(0, 6)?.map((term) => (
                <span key={term} className="text-xs text-accent bg-accent/10 px-2 py-1 rounded-full">
                  {term}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;