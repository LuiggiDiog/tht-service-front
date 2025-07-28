import { ReactNode } from 'react';
import { Outlet } from 'react-router';

type Props = {
  children?: ReactNode;
  isDarkMode?: boolean;
};

export default function GuestContainerLayout(props: Props) {
  const { children, isDarkMode } = props;

  const handleChildren = () => {
    if (children) return children;
    return <Outlet />;
  };

  return (
    <div
      className={`${isDarkMode && 'dark'} overflow-hidden lg:overflow-visible`}
    >
      <div className="pt-14 min-h-screen w-screen transition-position lg:w-auto bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
        <div className="container mx-auto px-4 py-6">{handleChildren()}</div>
      </div>
    </div>
  );
}
