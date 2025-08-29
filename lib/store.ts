import { create } from 'zustand';
import { VibeApp, AppState } from '@/types/domain';

interface AppStore extends AppState {
  setSelectedApp: (url: string | null) => void;
  removeApp: (id: string) => void;
  updateApp: (id: string, updates: Partial<VibeApp>) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  apps: [
    {
      id: 'claude-code',
      name: 'Claude Code',
      url: 'https://claude-credit-tracker.vercel.app/',
      logoUrl: '/cursor-battle/images/claude-icon-8x.png',
      isDefault: true,
    },
    {
      id: 'agent-claude',
      name: 'Agent Claude',
      url: 'https://agtech-credit-tracker-s3xf.vercel.app/',
      logoUrl: '/cursor-battle/images/cursor logo.jpeg',
      isDefault: true,
    },
  ],
  selectedAppUrl: null,
  
  setSelectedApp: (url) => set({ selectedAppUrl: url }),
  
  removeApp: (id) => set((state) => ({
    apps: state.apps.filter(app => app.id !== id && !app.isDefault)
  })),
  
  updateApp: (id, updates) => set((state) => ({
    apps: state.apps.map(app => 
      app.id === id ? { ...app, ...updates } : app
    ),
    // Update selected URL if we're updating the currently selected app
    selectedAppUrl: state.selectedAppUrl && state.apps.find(app => app.id === id && app.url === state.selectedAppUrl) 
      ? updates.url || state.selectedAppUrl 
      : state.selectedAppUrl
  })),
}));
