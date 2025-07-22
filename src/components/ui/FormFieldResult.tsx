import { SPACE_STRING } from '@/utils/constants';

type ValueT = {
  label: string;
  value: string | number;
};

type Props = {
  label: string;
  values: ValueT[];
};

export default function FormFieldResult(props: Props) {
  const { label, values = [] } = props;

  const childrenCount = values.length;
  let elementWrapperClass = '';

  switch (childrenCount) {
    case 2:
      elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-2';
      break;
    case 3:
      elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-3';
      break;
    case 4:
      elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-4';
  }

  const controlClassName = [
    'px-3 py-3 max-w-full border-gray-700 rounded w-full dark:placeholder-gray-400',
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none',
    'h-12',
    'border',
    'bg-white dark:bg-slate-800',
    'mt-2',
  ].join(SPACE_STRING);

  return (
    <div className="mb-6 last:mb-0">
      <label className={`block font-bold mb-2`}>{label}</label>
      <div className={elementWrapperClass}>
        {values.map((item, index) => (
          <div className="relative" key={index}>
            <label className="font-bold">{item.label}</label>
            <div className={controlClassName}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
