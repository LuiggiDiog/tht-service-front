import { MenuNavBarItem } from '../menuNavBar';
import NavBarItem from './NavBarItem';

type Props = {
  menu: MenuNavBarItem[];
  onItemClick?: () => void;
};

export default function NavBarMenuList({ menu, onItemClick }: Props) {
  const handleItemClick = (item: MenuNavBarItem) => {
    if (item.onClick) {
      item.onClick();
      onItemClick?.();
    }
  };

  return (
    <>
      {menu.map((item, index) => (
        <NavBarItem
          item={{
            ...item,
            onClick: () => handleItemClick(item),
          }}
          key={index}
        />
      ))}
    </>
  );
}
