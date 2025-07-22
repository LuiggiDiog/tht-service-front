import BaseIcon from '../BaseIcon';

type Props = {
  children: React.ReactNode;
  showModal: boolean;
  setShowModal?: (showModal: boolean) => void;
  title: string;
};

export default function ModalCustom(props: Props) {
  const { children, showModal, setShowModal, title } = props;

  if (!showModal) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden outline-none focus:outline-none"
        onClick={() => setShowModal && setShowModal(false)}
      >
        <div
          className="relative my-6 mx-auto w-auto max-w-5xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* content */}
          <div className="bg-white dark:bg-slate-900 relative flex w-full flex-col rounded-lg border-0 shadow-lg outline-none focus:outline-none p-5">
            {/* header */}
            <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3">
              <h3 className="text-lg px-2">{title}</h3>
              <button
                className="float-right ml-auto border-0 p-1 text-xl font-semibold leading-none outline-none focus:outline-none"
                onClick={() => setShowModal && setShowModal(false)}
              >
                <BaseIcon path="mdiClose" />
              </button>
            </div>
            {/* body */}
            <div className="relative max-h-[70vh] flex-auto overflow-auto">
              {children}
            </div>
            {/* footer */}
            <div className="flex items-center justify-end border-t border-gray-200 dark:border-gray-700 pt-2">
              <button
                className="background-transparent mr-1 mb-1 px-6 py-2 text-sm font-bold uppercase text-red-500 outline-none transition-all duration-150 ease-linear focus:outline-none"
                type="button"
                onClick={() => setShowModal && setShowModal(false)}
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="fixed inset-0 z-40 bg-black opacity-25"></div>
    </>
  );
}
