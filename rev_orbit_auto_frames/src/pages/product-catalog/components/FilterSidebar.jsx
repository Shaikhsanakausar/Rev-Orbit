import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/Checkbox';

const FilterSidebar = ({ filters, onFilterChange, onClearFilters, isOpen, onClose }) => {
  const [expandedSections, setExpandedSections] = useState({
    carType: true,
    era: true,
    frameStyle: true,
    priceRange: true
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const handleFilterChange = (category, value) => {
    const currentFilters = filters?.[category] || [];
    const updatedFilters = currentFilters?.includes(value)
      ? currentFilters?.filter(item => item !== value)
      : [...currentFilters, value];
    
    onFilterChange(category, updatedFilters);
  };

  const filterSections = [
    {
      key: 'carType',
      title: 'Car Type',
      options: [
        { value: 'classic', label: 'Classic Cars', count: 45 },
        { value: 'sports', label: 'Sports Cars', count: 32 },
        { value: 'luxury', label: 'Luxury Cars', count: 28 },
        { value: 'vintage', label: 'Vintage Cars', count: 38 },
        { value: 'muscle', label: 'Muscle Cars', count: 22 },
        { value: 'jdm', label: 'JDM Cars', count: 18 }
      ]
    },
    {
      key: 'era',
      title: 'Era',
      options: [
        { value: '1950s', label: '1950s', count: 12 },
        { value: '1960s', label: '1960s', count: 18 },
        { value: '1970s', label: '1970s', count: 24 },
        { value: '1980s', label: '1980s', count: 28 },
        { value: '1990s', label: '1990s', count: 35 },
        { value: '2000s', label: '2000s', count: 42 },
        { value: '2010s', label: '2010s', count: 38 },
        { value: '2020s', label: '2020s', count: 26 }
      ]
    },
    {
      key: 'frameStyle',
      title: 'Frame Style',
      options: [
        { value: 'classic', label: 'Classic Frame', count: 68 },
        { value: 'shadowbox', label: 'Shadow Box', count: 45 },
        { value: 'custom', label: 'Custom Design', count: 32 },
        { value: 'floating', label: 'Floating Frame', count: 28 },
        { value: 'gallery', label: 'Gallery Wall', count: 15 }
      ]
    },
    {
      key: 'priceRange',
      title: 'Price Range (₹)',
      options: [
        { value: '0-5000', label: 'Under ₹5,000', count: 25 },
        { value: '5000-10000', label: '₹5,000 - ₹10,000', count: 42 },
        { value: '10000-20000', label: '₹10,000 - ₹20,000', count: 38 },
        { value: '20000-50000', label: '₹20,000 - ₹50,000', count: 28 },
        { value: '50000+', label: 'Above ₹50,000', count: 15 }
      ]
    }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      {/* Sidebar */}
      <div className={`
        fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-80 bg-card border-r border-border z-50
        transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        overflow-y-auto automotive-shadow-lg lg:shadow-none
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="font-headline font-semibold text-lg text-primary">Filters</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground hover:text-primary"
            >
              Clear All
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="lg:hidden"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>
        </div>

        {/* Trending Collections */}
        <div className="p-6 border-b border-border">
          <h3 className="font-headline font-medium text-sm text-primary mb-4">Trending Collections</h3>
          <div className="space-y-3">
            {[
              { name: 'Indian Classics', count: 24, color: 'bg-heritage-green' },
              { name: 'Modern Supercars', count: 18, color: 'bg-racing-red' },
              { name: 'Racing Legends', count: 15, color: 'bg-automotive-orange' }
            ]?.map((collection) => (
              <button
                key={collection?.name}
                className="flex items-center justify-between w-full p-3 rounded-lg bg-muted hover:bg-muted/80 automotive-transition group"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${collection?.color}`} />
                  <span className="font-body text-sm text-primary group-hover:text-accent">{collection?.name}</span>
                </div>
                <span className="font-body text-xs text-muted-foreground">{collection?.count}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Filter Sections */}
        <div className="p-6 space-y-6">
          {filterSections?.map((section) => (
            <div key={section?.key} className="space-y-3">
              <button
                onClick={() => toggleSection(section?.key)}
                className="flex items-center justify-between w-full group"
              >
                <h3 className="font-headline font-medium text-sm text-primary group-hover:text-accent automotive-transition">
                  {section?.title}
                </h3>
                <Icon 
                  name={expandedSections?.[section?.key] ? "ChevronUp" : "ChevronDown"} 
                  size={16} 
                  className="text-muted-foreground group-hover:text-accent automotive-transition"
                />
              </button>
              
              {expandedSections?.[section?.key] && (
                <div className="space-y-2 pl-2">
                  {section?.options?.map((option) => (
                    <label
                      key={option?.value}
                      className="flex items-center justify-between cursor-pointer group py-1"
                    >
                      <div className="flex items-center space-x-3">
                        <Checkbox
                          checked={filters?.[section?.key]?.includes(option?.value) || false}
                          onChange={() => handleFilterChange(section?.key, option?.value)}
                          size="sm"
                        />
                        <span className="font-body text-sm text-primary group-hover:text-accent automotive-transition">
                          {option?.label}
                        </span>
                      </div>
                      <span className="font-body text-xs text-muted-foreground">
                        {option?.count}
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;