import justboilLogoPath from './logoPath';

type Props = {
  className?: string;
};

export default function JustboilLogo({ className = '' }: Props) {
  return (
    <svg
      className={className}
      height="100"
      viewBox="0 0 250 100"
      width="250"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={justboilLogoPath} fill="currentColor" />
    </svg>
  );
}
