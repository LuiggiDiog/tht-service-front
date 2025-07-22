import { useEffect, useState } from 'react';
import { EMPTY_STRING, TIME_DEBOUNCE } from '@/utils/constants';

type Props = {
  globalFilter: string;
  setGlobalFilter: (value: string) => void;
};

export default function GlobalFilter(props: Props) {
  const { setGlobalFilter } = props;
  const [value, setValue] = useState(EMPTY_STRING);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setGlobalFilter(value);
    }, TIME_DEBOUNCE);

    return () => clearTimeout(timeout);
  }, [value, setGlobalFilter]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative mt-1">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-500"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            ></path>
          </svg>
        </div>
        <input
          type="text"
          id="table-search"
          className="bg-gray-100 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-lg text-sm block w-80 pl-10 p-2 focus:outline-none"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Buscar..."
        />
      </div>
    </div>
  );
}
