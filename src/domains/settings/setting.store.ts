import { create } from 'zustand';

type StateSettingT = {
  isDarkMode: boolean;
};

type ActionsSettingT = {
  toggleDarkMode: () => void;
};

export type SettingStoreT = StateSettingT & ActionsSettingT;

export const useSettingStore = create<StateSettingT & ActionsSettingT>(
  (set) => ({
    isDarkMode: true,
    toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  })
);
