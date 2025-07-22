import { ReactNode } from 'react';
import { containerMaxW } from '@/components/componentConfig';
import JustboilLogo from '@/components/ui/justboilLogo';

type Props = {
  children?: ReactNode;
  company?: string;
};

export default function FooterBar(props: Props) {
  const { children, company = '' } = props;

  const year = new Date().getFullYear();

  return (
    <footer className={`py-2 px-6 ${containerMaxW}`}>
      <div className="block md:flex items-center justify-between">
        <div className="text-center md:text-left mb-6 md:mb-0">
          <b>
            &copy;{year}.{' '}
            <a href="https://justboil.me/" rel="noreferrer" target="_blank">
              {company}
            </a>
          </b>
          {children}
        </div>
        <div className="md:py-2">
          <a href="https://justboil.me" rel="noreferrer" target="_blank">
            <JustboilLogo className="w-auto h-8 md:h-6 mx-auto" />
          </a>
        </div>
      </div>
    </footer>
  );
}
