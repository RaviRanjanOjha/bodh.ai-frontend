import { create } from 'zustand';

const useSideNavStore = create((set) => ({
  isNavigationCollapsed: false,
  setToggleNavigation: () => {
    set((state) => ({ isNavigationCollapsed: !state.isNavigationCollapsed }));
  },
  setNavigation: (value) => {
    set((state) => ({ ...state, isNavigationCollapsed: value }));
  },
}));

export default useSideNavStore;
