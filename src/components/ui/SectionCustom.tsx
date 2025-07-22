import React from 'react';
import LoadingSection from './loadings/LoadingSection';
import { EMPTY_STRING } from '@/utils/constants';

type Props = {
  children?: React.ReactNode;
  isLoading?: boolean;
  isGuestBasic?: boolean;
};

export default function SectionCustom(props: Props) {
  const { children, isLoading, isGuestBasic = false } = props;

  if (isLoading) {
    return <LoadingSection />;
  }

  const className = isGuestBasic ? 'pt-6 px-2 lg:p-10' : EMPTY_STRING;

  return <div className={className}>{children}</div>;
}
