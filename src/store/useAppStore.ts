'use client';
import { create } from 'zustand';

interface AppStore {
  mobileMenuOpen: boolean;
  activeModal: string | null;
  setMobileMenuOpen: (val: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
}

export const useAppStore = create<AppStore>()((set) => ({
  mobileMenuOpen: false,
  activeModal: null,
  setMobileMenuOpen: (val) => set({ mobileMenuOpen: val }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
}));
