import { ReactNode } from 'react';
import { containerMaxW, containerMinH } from '@/components/componentConfig';

type Props = {
  children: ReactNode;
};

export default function SectionMain({ children }: Props) {
  return (
    <section className={`p-6 ${containerMaxW + ' ' + containerMinH}`}>
      {children}
    </section>
  );
}
