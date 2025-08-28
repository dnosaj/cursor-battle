'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AddAppFormData } from '@/types/domain';
import { validateUrl } from '@/lib/utils';
import { X, Plus, ExternalLink } from 'lucide-react';

interface AddAppModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (data: AddAppFormData) => Promise<void>;
}

export function AddAppModal({ isOpen, onClose, onAdd }: AddAppModalProps) {
  const [formData, setFormData] = useState<AddAppFormData>({
    name: '',
    url: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<AddAppFormData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<AddAppFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Application name is required';
    }
    
    if (!formData.url.trim()) {
      newErrors.url = 'Application URL is required';
    } else if (!validateUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    try {
      await onAdd(formData);
      setFormData({ name: '', url: '' });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Failed to add app:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setFormData({ name: '', url: '' });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 animate-slide-in">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Application
          </h2>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="app-name" className="block text-sm font-medium text-gray-700 mb-1">
              Application Name
            </label>
            <input
              id="app-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., My Custom App"
              className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              disabled={isLoading}
              autoFocus
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="app-url" className="block text-sm font-medium text-gray-700 mb-1">
              Application URL
            </label>
            <div className="relative">
              <input
                id="app-url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                placeholder="https://example.com/my-app"
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  errors.url ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              <ExternalLink className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                'Add Application'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
