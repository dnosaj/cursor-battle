export interface VibeApp {
  id: string;
  name: string;
  url: string;
  logoUrl: string;
  isDefault?: boolean;
}

export interface AppState {
  apps: VibeApp[];
  selectedAppUrl: string | null;
  isAddModalOpen: boolean;
}

export interface AddAppFormData {
  name: string;
  url: string;
}
