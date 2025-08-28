import { create } from 'zustand';
import { VibeApp, AppState } from '@/types/domain';

interface AppStore extends AppState {
  setSelectedApp: (url: string | null) => void;
  addApp: (app: Omit<VibeApp, 'id'>) => void;
  setAddModalOpen: (open: boolean) => void;
  removeApp: (id: string) => void;
  updateApp: (id: string, updates: Partial<VibeApp>) => void;
}

export const useAppStore = create<AppStore>((set) => ({
  apps: [
    {
      id: 'tempo',
      name: 'Tempo',
      url: 'https://c835d2d2-97e8-40cc-9f85-58e3260c091c.canvases.tempo.build/',
      logoUrl: '/vibe-code-tests/images/tempo-logo.svg',
      isDefault: true,
    },
    {
      id: 'v0',
      name: 'V0',
      url: 'https://v0-agent-action-scope-composer.vercel.app/',
      logoUrl: '/vibe-code-tests/images/v0-logo.svg',
      isDefault: true,
    },
    {
      id: 'figma',
      name: 'Figma',
      url: 'https://cloud-raft-91473432.figma.site/',
      logoUrl: '/vibe-code-tests/images/figma-logo.svg',
      isDefault: true,
    },
  ],
  selectedAppUrl: null,
  isAddModalOpen: false,
  
  setSelectedApp: (url) => set({ selectedAppUrl: url }),
  
  addApp: (appData) => set((state) => ({
    apps: [...state.apps, {
      ...appData,
      id: `app-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }]
  })),
  
  setAddModalOpen: (open) => set({ isAddModalOpen: open }),
  
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
