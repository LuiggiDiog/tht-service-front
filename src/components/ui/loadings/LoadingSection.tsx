import Spinner from '../Spinner';

type Props = {
  height?: string;
};

export default function LoadingSection(props: Props) {
  const { height } = props;
  const classHeight = height || 'h-[calc(100vh-160px)]';
  return (
    <div className={`flex justify-center items-center w-full ${classHeight}`}>
      <Spinner />
    </div>
  );
}
