import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { useState } from 'react';
import { Link } from 'react-router';
import { MenuNavBarItem } from '../menuNavBar';
import NavBarMenuList from './NavBarMenuList';
import UserAvatarCurrentUser from './UserAvatarCurrentUser';
import BaseDivider from '@/components/ui/BaseDivider';
import BaseIcon from '@/components/ui/BaseIcon';
import { useAuthStore } from '@/domains/auth';
import { useSettingStore } from '@/domains/settings';

type Props = {
  item: MenuNavBarItem;
};

export default function NavBarItem({ item }: Props) {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user) as { name: string };
  const toggleDarkMode = useSettingStore((state) => state.toggleDarkMode);

  const navBarItemLabelActiveColorStyle = 'text-slate-500';
  const navBarItemLabelStyle = 'text-slate-400';
  const navBarItemLabelHoverStyle = 'text-slate-500';

  const [isDropdownActive, setIsDropdownActive] = useState(false);

  const componentClass = [
    'block lg:flex items-center relative cursor-pointer',
    isDropdownActive
      ? `${navBarItemLabelActiveColorStyle} dark:text-slate-400`
      : `${navBarItemLabelStyle} dark:text-white dark:hover:text-slate-400 ${navBarItemLabelHoverStyle}`,
    item.menu ? 'lg:py-2 lg:px-3' : 'py-2 px-3',
    item.isDesktopNoLabel ? 'lg:w-16 lg:justify-center' : '',
  ].join(' ');

  const itemLabel = item.isCurrentUser ? user?.name : item.label;

  const handleMenuClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (item.menu) {
      setIsDropdownActive(!isDropdownActive);
      return;
    }

    if (item.isLogout) {
      logout();
      return;
    }

    if (item.isToggleLightDark) {
      toggleDarkMode();
      return;
    }

    if (item.onClick) {
      item.onClick();
    }
  };

  const NavBarItemComponentContents = (
    <>
      <div
        className={`flex items-center ${
          item.menu
            ? 'bg-gray-100 dark:bg-slate-800 lg:bg-transparent lg:dark:bg-transparent p-3 lg:p-0'
            : ''
        }`}
        onClick={handleMenuClick}
      >
        {item.isCurrentUser && (
          <UserAvatarCurrentUser className="w-6 h-6 mr-3 inline-flex" />
        )}
        {item.icon && (
          <BaseIcon className="transition-colors" path={item.icon} />
        )}
        <span
          className={`px-2 transition-colors ${
            item.isDesktopNoLabel && item.icon ? 'lg:hidden' : ''
          }`}
        >
          {itemLabel}
        </span>
        {Array.isArray(item.menu) && item.menu.length > 0 && (
          <BaseIcon
            className="hidden lg:inline-flex transition-colors"
            path={isDropdownActive ? mdiChevronUp : mdiChevronDown}
          />
        )}
      </div>
      {Array.isArray(item.menu) && item.menu.length > 0 && (
        <div
          className={`${
            !isDropdownActive ? 'lg:hidden' : ''
          } text-sm border-b border-gray-100 lg:border lg:bg-white lg:absolute lg:top-full lg:left-0 lg:min-w-full lg:z-20 lg:rounded-lg lg:shadow-lg lg:dark:bg-slate-800 dark:border-slate-700`}
        >
          <NavBarMenuList
            menu={item.menu}
            onItemClick={() => setIsDropdownActive(false)}
          />
        </div>
      )}
    </>
  );

  if (item.isDivider) {
    return <BaseDivider navBar />;
  }

  if (item.href) {
    return (
      <Link className={componentClass} target={item.target} to={item.href}>
        {NavBarItemComponentContents}
      </Link>
    );
  }

  return <div className={componentClass}>{NavBarItemComponentContents}</div>;
}
