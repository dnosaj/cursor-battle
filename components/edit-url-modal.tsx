'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { validateUrl } from '@/lib/utils';
import { X, Edit, ExternalLink } from 'lucide-react';

interface EditUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  appName: string;
  onSave: (newUrl: string) => void;
}

export function EditUrlModal({ isOpen, onClose, currentUrl, appName, onSave }: EditUrlModalProps) {
  const [url, setUrl] = useState(currentUrl);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setUrl(currentUrl);
      setError('');
    }
  }, [isOpen, currentUrl]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!url.trim()) {
      setError('URL is required');
      return;
    }
    
    if (!validateUrl(url)) {
      setError('Please enter a valid URL');
      return;
    }
    
    setIsLoading(true);
    try {
      onSave(url);
      onClose();
    } catch (error) {
      console.error('Failed to update URL:', error);
      setError('Failed to update URL');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    if (!isLoading) {
      setUrl(currentUrl);
      setError('');
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
            <Edit className="w-5 h-5" />
            Edit {appName} URL
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
            <label htmlFor="edit-url" className="block text-sm font-medium text-gray-700 mb-1">
              Application URL
            </label>
            <div className="relative">
              <input
                id="edit-url"
                type="url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError('');
                }}
                className={`w-full px-3 py-2 pr-10 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  error ? 'border-red-300' : 'border-gray-300'
                }`}
                disabled={isLoading}
                autoFocus
              />
              <ExternalLink className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
            </div>
            {error && (
              <p className="mt-1 text-sm text-red-600">{error}</p>
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
                  Saving...
                </div>
              ) : (
                'Save URL'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
