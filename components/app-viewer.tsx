'use client';

import { useState } from 'react';
import { ExternalLink, RefreshCw, Edit } from 'lucide-react';

interface AppViewerProps {
  url: string | null;
  className?: string;
  onEdit?: () => void;
}

export function AppViewer({ url, className = '', onEdit }: AppViewerProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const handleRefresh = () => {
    setIsLoading(true);
    setHasError(false);
    // Force iframe reload with cache bypass
    const iframe = document.getElementById('app-iframe') as HTMLIFrameElement;
    if (iframe) {
      // Add timestamp to bypass cache
      const currentUrl = new URL(iframe.src);
      currentUrl.searchParams.set('_refresh', Date.now().toString());
      iframe.src = currentUrl.toString();
    }
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  if (!url) {
    return (
      <div className={`flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg ${className}`}>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
            <ExternalLink className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No Application Selected
          </h3>
          <p className="text-gray-500 max-w-sm">
            Click on one of the application buttons to load it here, or add a new application using the "Add App" button.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-lg border border-gray-200 overflow-hidden ${className}`}>
      {/* Top right control buttons */}
      <div className="absolute top-3 right-6 z-20 flex gap-2">
        {onEdit && (
          <button
            onClick={onEdit}
            className="w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200"
            aria-label="Edit application URL"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
        )}
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="w-8 h-8 bg-white/90 hover:bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50"
          aria-label="Refresh application"
        >
          <RefreshCw className={`w-4 h-4 text-gray-600 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80">
          <div className="flex items-center gap-2 text-gray-600">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin" />
            <span>Loading application...</span>
          </div>
        </div>
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <ExternalLink className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Failed to Load Application
            </h3>
            <p className="text-gray-500 mb-4 max-w-sm">
              The application couldn't be loaded. This might be due to CORS restrictions or the application being unavailable.
            </p>
            <button
              onClick={handleRefresh}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Main iframe */}
      <iframe
        id="app-iframe"
        src={url}
        className="w-full h-full border-0"
        onLoad={handleLoad}
        onError={handleError}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-modals allow-top-navigation allow-top-navigation-by-user-activation"
        loading="lazy"
        title="Application Viewer"
        allow="fullscreen; web-share; clipboard-read; clipboard-write"
        referrerPolicy="no-referrer-when-downgrade"
        style={{ 
          colorScheme: 'normal',
          isolation: 'isolate',
          minHeight: '1200px',
          width: '100%',
          height: '100%'
        }}
      />

      {/* Footer with controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <ExternalLink className="w-4 h-4" />
          <span className="truncate max-w-md">{url}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-1 text-gray-500 hover:text-gray-700 disabled:opacity-50"
            aria-label="Refresh application"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 text-gray-500 hover:text-gray-700"
            aria-label="Open in new tab"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}
