import React from 'react';
import CardBox from '@/components/ui/cardBox';

type Props = {
  children: React.ReactNode;
  isMain?: boolean;
};

export default function ContainerTable(props: Props) {
  const { children, isMain = false } = props;

  if (isMain) {
    return (
      <CardBox className="mb-6" hasTable>
        {children}
      </CardBox>
    );
  }

  return <>{children}</>;
}
