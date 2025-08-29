import { mdiChevronDown, mdiChevronUp } from '@mdi/js';
import { useState } from 'react';
import { Link } from 'react-router';
import { MenuAsideItem } from '../menuAside';
import AsideMenuList from './AsideMenuList';
import BaseIcon from '@/components/ui/BaseIcon';
import { getButtonColor } from '@/components/ui/baseButton/baseButton.util';
import { useAuthStore } from '@/domains/auth';
import { validatePermissionItem } from '@/domains/permissions/permissions';

type Props = {
  item: MenuAsideItem;
  isDropdownList?: boolean;
};

const AsideMenuItem = ({ item, isDropdownList = false }: Props) => {
  /* const [isLinkActive, setIsLinkActive] = useState(false); */
  const [isDropdownActive, setIsDropdownActive] = useState(false);

  /* const asideMenuItemStyle = useAppSelector(
    (state) => state.style.asideMenuItemStyle
  );
  const asideMenuDropdownStyle = useAppSelector(
    (state) => state.style.asideMenuDropdownStyle
  );
  const asideMenuItemActiveStyle = useAppSelector(
    (state) => state.style.asideMenuItemActiveStyle
  );

  const activeClassAddon =
    !item.color && isLinkActive ? asideMenuItemActiveStyle : ''; */

  // TODO: Add active state to zustand

  const asideMenuItemStyle = '';
  const asideMenuDropdownStyle = '';
  const activeClassAddon = '';

  const currentUser = useAuthStore((state) => state.user);
  const permission = validatePermissionItem({
    id: currentUser?.role || '',
    item,
  });

  const asideMenuItemInnerContents = (
    <>
      {item.icon && (
        <BaseIcon
          className={`flex-none ${activeClassAddon}`}
          path={item.icon}
          size="18"
          w="w-12"
        />
      )}
      <span
        className={`grow text-ellipsis line-clamp-1 ${
          item.menu ? '' : 'pr-6'
        } ${activeClassAddon}`}
      >
        {item.label}
      </span>
      {item.menu && (
        <BaseIcon
          className={`flex-none ${activeClassAddon}`}
          path={isDropdownActive ? mdiChevronUp : mdiChevronDown}
          w="w-12"
        />
      )}
    </>
  );

  const componentClass = [
    'flex cursor-pointer',
    isDropdownList ? 'py-3 px-6 text-sm' : 'py-3',
    item.color
      ? getButtonColor(item.color, false, true)
      : `${asideMenuItemStyle} text-slate-300 hover:text-white`,
  ].join(' ');

  if (!permission) return null;

  return (
    <li>
      {item.href && (
        <Link className={componentClass} target={item.target} to={item.href}>
          {asideMenuItemInnerContents}
        </Link>
      )}

      {!item.href && (
        <div
          className={componentClass}
          onClick={() => setIsDropdownActive(!isDropdownActive)}
        >
          {asideMenuItemInnerContents}
        </div>
      )}
      {item.menu && (
        <AsideMenuList
          className={`${asideMenuDropdownStyle} ${
            isDropdownActive ? 'block bg-slate-800/50 pl-6' : 'hidden'
          }`}
          isDropdownList
          menu={item.menu}
        />
      )}
    </li>
  );
};

export default AsideMenuItem;
