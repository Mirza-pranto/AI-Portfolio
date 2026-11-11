import { create } from 'zustand';

export type PageType = 'home' | 'me' | 'education' | 'experience' | 'projects' | 'skills' | 'fun' | 'contact';
export type ExpandedItemType = 'project' | 'fun' | 'education' | 'experience' | 'skill' | null;

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

interface PortfolioState {
  activePage: PageType;
  setActivePage: (page: PageType) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  isRenderingUi: boolean;
  setIsRenderingUi: (val: boolean) => void;
  hasInteracted: boolean;
  setHasInteracted: (interacted: boolean) => void;
  messages: Message[];
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  showQuickQuestions: boolean;
  toggleQuickQuestions: () => void;
  // Expanded Detail View state
  expandedItemType: ExpandedItemType;
  expandedItemId: string | null;
  setExpandedItem: (type: 'project' | 'fun' | 'education' | 'experience' | 'skill', id: string | number) => void;
  clearExpandedItem: () => void;
  // AI Companion state
  companionMessage: string | null;
  setCompanionMessage: (message: string | null) => void;
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  activePage: 'home',
  setActivePage: (page) =>
    set({
      activePage: page,
      hasInteracted: true,
      expandedItemType: null,
      expandedItemId: null,
    }),
  isLoading: false,
  setIsLoading: (loading) => set({ isLoading: loading }),
  isRenderingUi: false,
  setIsRenderingUi: (val) => set({ isRenderingUi: val }),
  hasInteracted: false,
  setHasInteracted: (interacted) => set({ hasInteracted: interacted }),
  messages: [],
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  showQuickQuestions: true,
  toggleQuickQuestions: () =>
    set((state) => ({ showQuickQuestions: !state.showQuickQuestions })),
  // Expanded item defaults and actions
  expandedItemType: null,
  expandedItemId: null,
  setExpandedItem: (type, id) =>
    set({
      expandedItemType: type,
      expandedItemId: String(id),
    }),
  clearExpandedItem: () =>
    set({
      expandedItemType: null,
      expandedItemId: null,
    }),
  // AI Companion
  companionMessage: null,
  setCompanionMessage: (message) => set({ companionMessage: message }),
}));
