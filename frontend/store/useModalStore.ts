import { create } from 'zustand';

interface ModalState {
  isOpen: boolean;
  view: string | null; 
  data?: any;
  atualizarGatilho: number;
  openModal: (view: string, data?: any) => void;
  closeModal: () => void;
  triggerUpdate: () => void;
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  view: null,
  data: {},
  atualizarGatilho: 0,
  openModal: (view, data) => set({ isOpen: true, view, data }),
  closeModal: () => set({ isOpen: false, view: null, data: {} }),
  triggerUpdate: () => set((state) => ({ atualizarGatilho: state.atualizarGatilho + 1 })),
}));