import { MenuAsideItem } from '../menuAside';
import AsideMenuLayer from './AsideMenuLayer';
import OverlayLayer from '@/components/ui/OverlayLayer';

type Props = {
  menu: MenuAsideItem[];
  isAsideMobileExpanded: boolean;
  isAsideLgActive: boolean;
  onAsideLgClose: () => void;
};

export default function AsideMenu({
  isAsideMobileExpanded = false,
  isAsideLgActive = false,
  ...props
}: Props) {
  return (
    <>
      <AsideMenuLayer
        className={`${
          isAsideMobileExpanded ? 'left-0' : '-left-60 lg:left-0'
        } ${!isAsideLgActive ? 'lg:hidden xl:flex' : ''}`}
        menu={props.menu}
        onAsideLgCloseClick={props.onAsideLgClose}
      />
      {isAsideLgActive && (
        <OverlayLayer onClick={props.onAsideLgClose} zIndex="z-30" />
      )}
    </>
  );
}
