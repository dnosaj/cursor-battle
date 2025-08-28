'use client';

import { useState } from 'react';
import Image from 'next/image';
import { VibeApp } from '@/types/domain';
import { cn } from '@/lib/utils';

interface AppButtonProps {
  app: VibeApp;
  isActive: boolean;
  onClick: () => void;
  onRemove?: () => void;
}

export function AppButton({ app, isActive, onClick, onRemove }: AppButtonProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <div className="relative group">
      <button
        onClick={onClick}
        className={cn(
          'app-button',
          isActive && 'active'
        )}
        aria-label={`Load ${app.name} application`}
      >
        <div className="flex items-center gap-3 flex-1">
          {!imageError ? (
            <Image
              src={app.logoUrl}
              alt={`${app.name} logo`}
              width={24}
              height={24}
              className="shrink-0"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-6 h-6 bg-gray-300 rounded flex items-center justify-center shrink-0">
              <span className="text-xs font-bold text-gray-600">
                {app.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <span className="font-medium text-gray-900">{app.name}</span>
        </div>
      </button>
      
      {onRemove && !app.isDefault && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center text-xs hover:bg-red-600"
          aria-label={`Remove ${app.name}`}
        >
          ×
        </button>
      )}
    </div>
  );
}
