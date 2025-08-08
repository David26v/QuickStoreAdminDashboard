// components/ImageUpload.jsx
'use client';
import React, { useState, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Camera, Loader2 } from 'lucide-react';

const ImageUpload = ({ label, value, onChange, icon: Icon, placeholder, previewAlt, borderColor = "border-gray-300", bgColor = "bg-gray-50" }) => {
  const fileInputRef = useRef(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const imageUrl = URL.createObjectURL(file);
      onChange(imageUrl);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  return (
    <div className="space-y-2">
      <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon className="w-4 h-4 text-orange-500" />
        {label}
      </Label>
      {/* URL Input */}
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent rounded-xl"
        placeholder={placeholder}
      />
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 transition-all duration-300 cursor-pointer ${
          isDragOver
            ? 'border-orange-500 bg-orange-50'
            : `${borderColor} ${bgColor} hover:border-orange-400 hover:bg-orange-25`
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFileSelect(e.target.files[0])}
          className="hidden"
        />
        <div className="flex flex-col items-center space-y-2">
          {uploading ? (
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          ) : (
            <div className="flex items-center space-x-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <Camera className="w-6 h-6 text-gray-400" />
            </div>
          )}
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">
              {uploading ? 'Uploading...' : 'Drop image here or click to browse'}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Supports JPG, PNG, GIF up to 10MB
            </p>
          </div>
        </div>
      </div>
      {/* Preview */}
      {value && !uploading && (
        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs font-medium text-gray-600 mb-2">Preview:</p>
          <img
            src={value}
            alt={previewAlt}
            className="w-32 h-32 object-cover border-2 border-gray-300 rounded-xl shadow-md"
            onError={(e) => {
              e.target.src = 'https://placehold.co/150x150/f3f4f6/9ca3af?text=Invalid+URL';
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;