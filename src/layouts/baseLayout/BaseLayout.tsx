import { ReactNode, useEffect } from 'react';
import { Outlet } from 'react-router';
import { useAuthStore } from '@/domains/auth';
import Toast, { useToastStore } from '@/domains/toast';

export type BaseLayoutProps = {
  children?: ReactNode;
};

export default function BaseLayout(props: BaseLayoutProps) {
  const { children } = props;

  const toasts = useToastStore((state) => state.toasts);
  const removeToast = useToastStore((state) => state.removeToast);

  const isAuth = useAuthStore((state) => state.isAuth);
  const auchInfo = useAuthStore((state) => state.auchInfo);

  useEffect(() => {
    if (!isAuth) return;
    auchInfo();
  }, [isAuth, auchInfo]);

  const handleChildren = () => {
    if (children) return children;
    return <Outlet />;
  };

  return (
    <>
      {handleChildren()}
      {Boolean(toasts.length) && (
        <div className="fixed pl-4 bottom-4 right-4 z-50 w-full max-w-sm md:max-w-md lg:max-w-lg transition-all">
          {toasts.map((toast) => (
            <Toast
              color={toast.color}
              duration={toast.duration}
              icon={toast.icon}
              key={toast.id}
              onDismiss={() => removeToast(toast.id as string)}
              outline={toast.outline}
            >
              {toast.title && <b>{toast.title}</b>} {toast.description}
            </Toast>
          ))}
        </div>
      )}
    </>
  );
}
