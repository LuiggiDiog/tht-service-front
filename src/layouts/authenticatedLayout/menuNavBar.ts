import { mdiLogout, mdiThemeLightDark } from '@mdi/js';

export type MenuNavBarItem = {
  label?: string;
  icon?: string;
  href?: string;
  target?: string;
  isDivider?: boolean;
  isLogout?: boolean;
  isDesktopNoLabel?: boolean;
  isToggleLightDark?: boolean;
  isCurrentUser?: boolean;
  menu?: MenuNavBarItem[];
  isExternal?: boolean;
  isListRoles?: boolean;
  isRole?: boolean;
  isStores?: boolean;
  onClick?: () => void;
};

export const menuNavBar: MenuNavBarItem[] = [
  {
    isCurrentUser: true,
  },
  {
    icon: mdiThemeLightDark,
    label: 'Cambiar Tema',
    isDesktopNoLabel: true,
    isToggleLightDark: true,
    isExternal: false,
  },
  {
    icon: mdiLogout,
    label: 'Cerrar Sesión',
    isDesktopNoLabel: true,
    isLogout: true,
  },
];
