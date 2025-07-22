import { MenuAsideItem } from '../menuAside';
import AsideMenuItem from './AsideMenuItem';

type Props = {
  menu: MenuAsideItem[];
  isDropdownList?: boolean;
  className?: string;
};

export default function AsideMenuList({
  menu,
  isDropdownList = false,
  className = '',
}: Props) {
  return (
    <ul className={className}>
      {menu.map((item, index) => (
        <AsideMenuItem
          isDropdownList={isDropdownList}
          item={item}
          key={index}
        />
      ))}
    </ul>
  );
}
