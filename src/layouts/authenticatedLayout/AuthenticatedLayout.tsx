import { mdiBackburger, mdiForwardburger, mdiMenu } from '@mdi/js';
import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import AsideMenu from './components/AsideMenu';
import FooterBar from './components/FooterBar';
import NavBar from './components/NavBar';
import NavBarItemPlain from './components/NavBarItemPlain';
import SectionMain from './components/SectionMain';
import menuAside from './menuAside';
import { menuNavBar } from './menuNavBar';
import BaseIcon from '@/components/ui/BaseIcon';
import { MenuNavBarItem } from '@/components/ui/ui.types';
import { useAuthStore } from '@/domains/auth';

type Props = {
  children?: ReactNode;
  isDarkMode?: boolean;
  company?: string;
};

export default function AuthenticatedLayout(props: Props) {
  const { children, isDarkMode, company } = props;

  const isAuth = useAuthStore((state) => state.isAuth);
  const [menuNavBarList] = useState<MenuNavBarItem[]>(menuNavBar);

  const location = useLocation();

  const [isAsideMobileExpanded, setIsAsideMobileExpanded] = useState(false);
  const [isAsideLgActive, setIsAsideLgActive] = useState(false);

  const layoutAsidePadding = 'xl:pl-60';

  const handleChildren = () => {
    if (children) return children;
    return <Outlet />;
  };

  useEffect(() => {}, []);

  if (!isAuth) {
    return <Navigate replace state={{ from: location }} to="/" />;
  }

  return (
    <div
      className={`${isDarkMode && 'dark'} overflow-hidden lg:overflow-visible`}
    >
      <div
        className={`${layoutAsidePadding} ${
          isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''
        } pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100`}
      >
        <NavBar
          className={`${layoutAsidePadding} ${
            isAsideMobileExpanded ? 'ml-60 lg:ml-0' : ''
          }`}
          menu={menuNavBarList}
        >
          <NavBarItemPlain
            display="flex lg:hidden"
            onClick={() => setIsAsideMobileExpanded(!isAsideMobileExpanded)}
          >
            <BaseIcon
              path={isAsideMobileExpanded ? mdiBackburger : mdiForwardburger}
              size="24"
            />
          </NavBarItemPlain>

          <NavBarItemPlain
            display="hidden lg:flex xl:hidden"
            onClick={() => setIsAsideLgActive(true)}
          >
            <BaseIcon path={mdiMenu} size="24" />
          </NavBarItemPlain>
        </NavBar>

        <AsideMenu
          isAsideLgActive={isAsideLgActive}
          isAsideMobileExpanded={isAsideMobileExpanded}
          menu={menuAside}
          onAsideLgClose={() => setIsAsideLgActive(false)}
        />

        <SectionMain>{handleChildren()}</SectionMain>

        <FooterBar company={company} />
      </div>
    </div>
  );
}
