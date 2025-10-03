import { create } from 'zustand';

const useSideNavStore = create((set) => ({
  isNavigationCollapsed: false,
  setToggleNavigation: () => {
    set((state) => ({ isNavigationCollapsed: !state.isNavigationCollapsed }));
  },
}));

export default useSideNavStore;
