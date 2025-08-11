import { UserT } from '../user.type';

export default function UserNameDisplay({ user }: { user: UserT }) {
  return (
    <span className="font-medium text-gray-900 dark:text-gray-100">
      {user.name}
    </span>
  );
}
