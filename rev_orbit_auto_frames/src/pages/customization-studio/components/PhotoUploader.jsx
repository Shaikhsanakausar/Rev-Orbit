import React, { useState, useRef } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const PhotoUploader = ({ selectedPhoto, onPhotoChange }) => {
  const [dragActive, setDragActive] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileInputRef = useRef(null);

  const carLibrary = [
    {
      id: 'maruti-swift',
      name: 'Maruti Swift',
      category: 'Hatchback',
      image: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop'
    },
    {
      id: 'hyundai-creta',
      name: 'Hyundai Creta',
      category: 'SUV',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400&h=300&fit=crop'
    },
    {
      id: 'tata-nexon',
      name: 'Tata Nexon',
      category: 'Compact SUV',
      image: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400&h=300&fit=crop'
    },
    {
      id: 'mahindra-thar',
      name: 'Mahindra Thar',
      category: 'Off-road',
      image: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=400&h=300&fit=crop'
    },
    {
      id: 'bmw-x5',
      name: 'BMW X5',
      category: 'Luxury SUV',
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&h=300&fit=crop'
    },
    {
      id: 'mercedes-c-class',
      name: 'Mercedes C-Class',
      category: 'Luxury Sedan',
      image: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=400&h=300&fit=crop'
    }
  ];

  const handleDrag = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    if (e?.type === 'dragenter' || e?.type === 'dragover') {
      setDragActive(true);
    } else if (e?.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setDragActive(false);
    
    if (e?.dataTransfer?.files && e?.dataTransfer?.files?.[0]) {
      handleFileUpload(e?.dataTransfer?.files?.[0]);
    }
  };

  const handleFileUpload = (file) => {
    if (file && file?.type?.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        onPhotoChange({
          id: 'uploaded',
          name: file?.name,
          category: 'Uploaded',
          image: e?.target?.result,
          file: file
        });
      };
      reader?.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e) => {
    if (e?.target?.files && e?.target?.files?.[0]) {
      handleFileUpload(e?.target?.files?.[0]);
    }
  };

  const handleLibrarySelect = (car) => {
    onPhotoChange(car);
    setShowLibrary(false);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="font-headline text-2xl font-bold text-primary mb-2">Add Your Car Photo</h2>
        <p className="text-muted-foreground">Upload your car photo or choose from our curated library</p>
      </div>
      {/* Current Selection */}
      {selectedPhoto && (
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center space-x-4">
            <div className="w-20 h-16 rounded-lg overflow-hidden">
              <Image
                src={selectedPhoto?.image}
                alt={selectedPhoto?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="font-headline text-base font-semibold text-primary">{selectedPhoto?.name}</h3>
              <p className="text-sm text-muted-foreground">{selectedPhoto?.category}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={() => onPhotoChange(null)}
            />
          </div>
        </div>
      )}
      {/* Upload Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* File Upload */}
        <div
          className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer automotive-transition ${
            dragActive
              ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50 hover:bg-muted/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef?.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <div className="space-y-4">
            <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Upload" size={24} className="text-accent" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary mb-2">Upload Your Photo</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Drag and drop your car photo here, or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Supports Only PNG up to 10MB
              </p>
            </div>
          </div>
        </div>

        {/* Library Access */}
        <div
          className="border-2 border-border rounded-lg p-8 text-center cursor-pointer automotive-transition hover:border-accent/50 hover:bg-muted/50"
          onClick={() => setShowLibrary(true)}
        >
          <div className="space-y-4">
            <div className="w-16 h-16 bg-heritage-green/10 rounded-full flex items-center justify-center mx-auto">
              <Icon name="Image" size={24} className="text-heritage-green" />
            </div>
            <div>
              <h3 className="font-headline text-lg font-semibold text-primary mb-2">Choose from Library</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Browse our curated collection of popular car models
              </p>
              <p className="text-xs text-muted-foreground">
                High-quality photos ready to use
              </p>
            </div>
          </div>
        </div>
      </div>
      {/* Car Library Modal */}
      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="font-headline text-xl font-bold text-primary">Car Library</h3>
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={() => setShowLibrary(false)}
              />
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {carLibrary?.map((car) => (
                  <div
                    key={car?.id}
                    onClick={() => handleLibrarySelect(car)}
                    className="bg-muted rounded-lg overflow-hidden cursor-pointer automotive-transition hover:automotive-shadow"
                  >
                    <div className="h-32 overflow-hidden">
                      <Image
                        src={car?.image}
                        alt={car?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-3">
                      <h4 className="font-headline text-sm font-semibold text-primary">{car?.name}</h4>
                      <p className="text-xs text-muted-foreground">{car?.category}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Photo Guidelines */}
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <Icon name="Camera" size={20} className="text-accent mt-0.5" />
          <div>
            <h4 className="font-headline text-sm font-semibold text-primary mb-1">Photo Guidelines</h4>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Use high-resolution images (minimum 1200x800px)</li>
              <li>• Ensure good lighting and clear visibility</li>
              <li>• Side or 3/4 angle shots work best for framing</li>
              <li>• Avoid heavily filtered or edited photos</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotoUploader;