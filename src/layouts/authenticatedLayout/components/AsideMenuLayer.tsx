import { mdiClose, mdiLogout } from '@mdi/js';
import { MenuAsideItem } from '../menuAside';
import AsideMenuItem from './AsideMenuItem';
import AsideMenuList from './AsideMenuList';
import BaseIcon from '@/components/ui/BaseIcon';
import { useAuthStore } from '@/domains/auth';

type Props = {
  menu: MenuAsideItem[];
  className?: string;
  onAsideLgCloseClick: () => void;
};

export default function AsideMenuLayer({
  menu,
  className = '',
  ...props
}: Props) {
  const logout = useAuthStore((state) => state.logout);

  const logoutItem: MenuAsideItem = {
    label: 'Cerrar sesión',
    icon: mdiLogout,
    color: 'info',
    isLogout: true,
  };

  const handleAsideLgCloseClick = (e: React.MouseEvent) => {
    e.preventDefault();
    props.onAsideLgCloseClick();
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    logout();
  };

  return (
    <aside
      className={`${className} lg:py-2 lg:pl-2 w-60 fixed flex z-40 top-0 h-screen transition-position overflow-hidden`}
    >
      <div
        className={`lg:rounded-2xl flex-1 flex flex-col overflow-hidden bg-slate-900`}
      >
        <div
          className={`flex flex-row h-14 items-center justify-between bg-slate-900`}
        >
          <div className="text-center flex-1 lg:text-left lg:pl-6 xl:text-center xl:pl-0">
            <b className="font-black text-slate-300">Menú</b>
          </div>

          <button
            className="hidden lg:inline-block xl:hidden p-3"
            onClick={handleAsideLgCloseClick}
          >
            <BaseIcon path={mdiClose} />
          </button>
        </div>
        <div
          className={`flex-1 overflow-y-auto overflow-x-hidden aside-scrollbars-[slate]`}
        >
          <AsideMenuList menu={menu} />
        </div>

        <ul onClick={handleLogoutClick}>
          <AsideMenuItem item={logoutItem} />
        </ul>
      </div>
    </aside>
  );
}
