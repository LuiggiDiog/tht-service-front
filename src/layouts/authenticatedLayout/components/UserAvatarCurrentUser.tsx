import { ReactNode } from 'react';
import UserAvatar from '@/components/ui/UserAvatar';

type Props = {
  className?: string;
  children?: ReactNode;
};

export default function UserAvatarCurrentUser({
  className = '',
  children,
}: Props) {
  /* const userName = useAppSelector((state) => state.main.userName);
  const userAvatar = useAppSelector((state) => state.main.userAvatar); */
  // TODO: user info from zustand
  const userName = 'John Doe';
  const userAvatar = 'https://i.postimg.cc/x8cxrCMs/default-user-icon-8.jpg';

  return (
    <UserAvatar avatar={userAvatar} className={className} username={userName}>
      {children}
    </UserAvatar>
  );
}
