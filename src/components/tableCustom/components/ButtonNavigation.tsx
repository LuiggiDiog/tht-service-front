import BaseIcon from '../../ui/BaseIcon';

type ButtonNavigationProps = {
  onClick: () => void;
  disabled: boolean;
  icon: string;
};

export default function ButtonNavigation(props: ButtonNavigationProps) {
  const { onClick, disabled, icon } = props;

  return (
    <button
      className={
        `${disabled ? 'opacity-50' : ''}` +
        ' p-2 transition hover:cursor-default cursor-default'
      }
      onClick={onClick}
      disabled={disabled}
    >
      <BaseIcon path={icon} size="24" />
    </button>
  );
}
