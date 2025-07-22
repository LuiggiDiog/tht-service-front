import { ReactNode } from 'react';
import { Outlet } from 'react-router';

type Props = {
  children?: ReactNode;
};

export default function GuestLayout(props: Props) {
  const darkMode = true;

  const { children } = props;

  const handleChildren = () => {
    if (children) return children;
    return <Outlet />;
  };

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-slate-800 dark:text-slate-100">
        {handleChildren()}
      </div>
    </div>
  );
}
