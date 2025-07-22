import Spinner from '../Spinner';
import ModalCustom from './ModalBasic';

type Props = {
  isLoading: boolean;
  title?: string;
  text?: string;
};

export default function ModalLoading(props: Props) {
  const {
    isLoading,
    title = 'Procesando...',
    text = 'Por favor espere...',
  } = props;

  return (
    <ModalCustom showModal={isLoading} title={title}>
      <div className="flex flex-col items-center justify-center">
        <Spinner />
        <p className="text-center text-gray-700 text-sm mt-2 min w-56">
          {text}
        </p>
      </div>
    </ModalCustom>
  );
}
