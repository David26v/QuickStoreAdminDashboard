'use client';

import React, { useState } from 'react'; 
import { Button } from '@/components/ui/button';
import { X, Plus, Download, Save, Loader2 } from 'lucide-react';
import Tesseract from 'tesseract.js';

const DeviceModal = (props) => {

  const {
  isOpen,
  onClose,
  formData,
  setFormData,
  isSubmitting,
  handleSubmit,
  isFetchingAPK,
  setIsFetchingAPK, 
} = props;

  const handleImageUpload = (file) => {
    if (!file) return;

    setIsFetchingAPK(true); 
    const reader = new FileReader();

    reader.onload = async () => {
      try {
        const { data: { text } } = await Tesseract.recognize(reader.result, 'eng+chi_sim'); 
        const cleanText = text.replace(/\s+/g, ' ').trim();
        console.log("Cleaned OCR Text:", cleanText);

        const lines = text.split('\n').map(line => line.trim()).filter(Boolean);

        let model = '';
        let serial = '';
        let version = '';
        let algorithm = '';
        let mac = '';
        let manufacturer = '';

        for (let line of lines) {
          const lowerLine = line.toLowerCase();

          if (!model && /model|型号|设备/i.test(line)) {
            const match = line.split(/:|：/).pop()?.trim();
            if (match && match.length > 2 && !match.includes('model')) model = match;
          }

          if (!serial && /serial|序列号/i.test(line)) {
            serial = line.split(/:|：/).pop()?.trim();
          }

          if (!version && /version|版本/i.test(line) && !/android/i.test(lowerLine)) {
            version = line.split(/:|：/).pop()?.trim();
          }

          if (!algorithm && /algorithm|算法/i.test(line)) {
            algorithm = line.split(/:|：/).pop()?.trim();
          }

          if (!mac && /mac/i.test(lowerLine)) {
            const macMatch = line.match(/([0-9A-Fa-f]{2}[:\-]){5}[0-9A-Fa-f]{2}/);
            mac = macMatch ? macMatch[0] : line.split(/:|：/).pop()?.trim();
          }

          if (!manufacturer && /manufacturer|制造商|公司|智能|柜|系统/i.test(line)) {
            manufacturer = line.split(/:|：/).pop()?.trim();
          }
        }

        setFormData(prev => ({
          ...prev,
          model,
          device_id: serial,
          firmware_version: version,
          android_version: algorithm,
          app_version: version,
          manufacturer
        }));

        console.log('Extracted:', { model, serial, version, algorithm, mac, manufacturer });

      } catch (err) {
        console.error('OCR Parsing Error:', err);
      } finally {
        setIsFetchingAPK(false);
      }
    };

    reader.readAsDataURL(file);
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl border border-white/20 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl">
                <Plus className="h-5 w-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Add New Device</h2>
                <p className="text-gray-600">Register a new QuickStore locker device</p>
              </div>
            </div>
            <Button
              onClick={onClose} 
              variant="outline"
              size="sm"
              className="border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-6">
              <div className="bg-gradient-to-r from-orange-50 to-gray-50 p-4 rounded-xl border border-orange-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Download className="w-4 h-4 text-orange-500" />
                    Auto-Fill from APK
                  </h3>
                  <input
                    type="file"
                    accept="image/*"
                    id="apkImageUpload"
                    style={{ display: 'none' }}
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                  />
                  <Button
                    type="button"
                    onClick={() => document.getElementById('apkImageUpload').click()}
                    disabled={isFetchingAPK}
                    size="sm"
                    className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
                  >
                    {isFetchingAPK ? (
                      <>
                        <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-3 h-3 mr-1" />
                        upload Picture
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-sm text-gray-600">
                  Automatically detect and fill device information from installed APK files.
                </p>
              </div>
            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Device ID *
                </label>
                <input
                  type="text"
                  required
                  value={formData.device_id}
                  onChange={(e) => setFormData({ ...formData, device_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="QS-LOC-003"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manufacturer
                </label>
                <input
                  type="text"
                  value={formData.manufacturer}
                  onChange={(e) => setFormData({ ...formData, manufacturer: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Samsung, Huawei, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Model
                </label>
                <input
                  type="text"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="Galaxy Tab A8"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Android Version
                </label>
                <input
                  type="text"
                  value={formData.android_version}
                  onChange={(e) => setFormData({ ...formData, android_version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="12.0"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Firmware Version
                </label>
                <input
                  type="text"
                  value={formData.firmware_version}
                  onChange={(e) => setFormData({ ...formData, firmware_version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="2.1.4"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  App Version
                </label>
                <input
                  type="text"
                  value={formData.app_version}
                  onChange={(e) => setFormData({ ...formData, app_version: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  placeholder="1.0.2"
                />
              </div>
              
            </div>
            {/* Form Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-end pt-4 border-t border-gray-200">
              <Button
                type="button"
                onClick={onClose} // Use onClose prop
                variant="outline"
                className="border-gray-300 hover:border-red-500 text-gray-700 hover:text-red-600"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white border-0"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Device
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeviceModal;