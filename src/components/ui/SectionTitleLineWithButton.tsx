import { mdiChevronLeft, mdiTableBorder } from '@mdi/js';
import { ReactNode } from 'react';
import { useNavigate } from 'react-router';
import BaseIcon from './BaseIcon';
import IconRounded from './IconRounded';

type Props = {
  icon?: string;
  title: string;
  main?: boolean;
  children?: ReactNode;
  backBtn?: boolean;
  onBack?: () => void;
  iconBack?: boolean;
};

export default function SectionTitleLineWithButton({
  icon = mdiTableBorder,
  title,
  main = false,
  children,
  iconBack,
}: Props) {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const handleIconBack = () => {
    if (iconBack) {
      return (
        <div onClick={handleBack}>
          <IconRounded
            bg
            className="mr-3"
            color="light"
            icon={mdiChevronLeft}
          />
        </div>
      );
    }

    if (icon && main) {
      return <IconRounded bg className="mr-3" color="light" icon={icon} />;
    }

    if (icon && !main) {
      return <BaseIcon className="mr-2" path={icon} size="20" />;
    }

    return null;
  };

  return (
    <section
      className={`${
        main ? '' : 'pt-6'
      } mb-6 flex items-center justify-between flex-wrap`}
    >
      <div className="flex items-center justify-start">
        {handleIconBack()}
        <h1 className={`leading-tight ${main ? 'text-3xl' : 'text-2xl'}`}>
          {title}
        </h1>
      </div>
      <div className="flex gap-2 w-full justify-center mt-2 md:w-auto md:mt-0">
        {children}
      </div>
    </section>
  );
}
