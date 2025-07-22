type Props = {
  navBar?: boolean;
  className?: string;
};

export default function BaseDivider({ navBar = false, className }: Props) {
  const classAddon = navBar
    ? 'hidden lg:block lg:my-0.5 dark:border-slate-700'
    : 'my-6 -mx-6 dark:border-slate-800';

  return (
    <hr className={`${classAddon} border-t border-gray-100 ${className}`} />
  );
}
