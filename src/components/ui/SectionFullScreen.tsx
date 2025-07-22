import { ReactNode } from 'react';
import { BgKey } from './ui.types';
import {
  gradientBgDark,
  gradientBgPinkRed,
  gradientBgPurplePink,
} from './ui.utils';

type Props = {
  bg: BgKey;
  children: ReactNode;
};

export default function SectionFullScreen({ bg, children }: Props) {
  /* const darkMode = useAppSelector((state) => state.style.darkMode); */
  // TODO: dark mode from zustand
  const darkMode = true;

  let componentClass = 'flex min-h-screen items-center justify-center ';

  if (darkMode) {
    componentClass += gradientBgDark;
  } else if (bg === 'purplePink') {
    componentClass += gradientBgPurplePink;
  } else if (bg === 'pinkRed') {
    componentClass += gradientBgPinkRed;
  }

  return <div className={componentClass}>{children}</div>;
}
