import { useCallback, useEffect, useMemo, useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useSettingStore } from '@/domains/settings';

export type OptionFormT = {
  label: string;
  value: string | number;
};

export type SetFieldValueT = (
  name: string,
  value: string | string[] | number | number[] | null
) => void;

interface SelectFieldProps {
  typeSelect?: 'basic' | 'selectCreate';
  options: OptionFormT[];
  isDisabled?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  field: {
    name: string;
    value: string | string[];
  };
  form: {
    setFieldValue: SetFieldValueT;
  };
  value?: string | string[] | number | number[];
  onChangeValue?: (
    value: string | string[],
    setFieldValue: SetFieldValueT
  ) => void;
  isBorderless?: boolean;
}

const COLORS = {
  darkBackgroundColor: '#1E293B',
  lightBackgroundColor: '#FFFFFF',
  lightBackgroundColorAlt: '#f1f5f9',
  darkTextColor: '#FFFFFF',
  lightTextColor: '#000000',
  selectedOptionColor: 'rgb(59 130 246)',
  placeholderColor: '#94a3b8',
};

export default function SelectField({
  typeSelect = 'basic',
  options,
  isDisabled = false,
  placeholder = 'Seleccione',
  isClearable = false,
  isSearchable = true,
  isMulti = false,
  field: { name, value: fieldValue },
  form: { setFieldValue },
  value: externalValue,
  onChangeValue,
  isBorderless = false,
}: SelectFieldProps) {
  const isDarkMode = useSettingStore((state) => state.isDarkMode);
  const generalMode = isDarkMode ? 'dark' : 'light';
  const currentValue = externalValue ?? fieldValue;

  // Estado interno para poder añadir opciones dinámicas
  const [internalOptions, setInternalOptions] =
    useState<OptionFormT[]>(options);
  useEffect(() => {
    setInternalOptions(options);
  }, [options]);

  const getBackgroundColor = useCallback(
    (isSelected = false) => {
      if (isSelected) return COLORS.selectedOptionColor;
      if (generalMode === 'dark') return COLORS.darkBackgroundColor;
      if (isBorderless) return COLORS.lightBackgroundColorAlt;
      return COLORS.lightBackgroundColor;
    },
    [generalMode, isBorderless]
  );

  const getTextColor = useCallback(
    (isSelected = false, isFocused = false) => {
      if (isFocused && !isSelected) return COLORS.selectedOptionColor;
      if (generalMode === 'dark') return COLORS.darkTextColor;
      return COLORS.lightTextColor;
    },
    [generalMode]
  );

  const customStyles: StylesConfig<OptionFormT, boolean> = useMemo(() => {
    const base: StylesConfig<OptionFormT, boolean> = isBorderless
      ? {
          control: (p) => ({
            ...p,
            border: '0',
            boxShadow: 'none',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
          }),
          container: (p) => ({ ...p, padding: 0, margin: 0 }),
          menu: (p) => ({
            ...p,
            backgroundColor: getBackgroundColor(),
            width: '200px',
          }),
          input: (p) => ({
            ...p,
            color: getTextColor(),
            padding: 0,
            margin: 0,
          }),
          valueContainer: (p) => ({ ...p, padding: 0, margin: 0 }),
        }
      : {
          control: (p) => ({
            ...p,
            border: '1px solid #374151',
            borderRadius: '4px',
            padding: '5px',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
          }),
          menu: (p) => ({ ...p, backgroundColor: getBackgroundColor() }),
          input: (p) => ({ ...p, color: getTextColor() }),
          valueContainer: (p) => p,
        };

    return {
      ...base,
      option: (p, state) => ({
        ...p,
        backgroundColor: getBackgroundColor(state.isSelected),
        color: getTextColor(state.isSelected, state.isFocused),
      }),
      singleValue: (p) => ({ ...p, color: getTextColor() }),
      placeholder: (p) => ({ ...p, color: COLORS.placeholderColor }),
      menuPortal: (p) => ({ ...p, zIndex: 9999 }),
    };
  }, [isBorderless, getBackgroundColor, getTextColor]);

  const [selectedOption, setSelectedOption] = useState<
    OptionFormT | OptionFormT[] | null
  >(null);

  // Busca en las opciones internas para incluir creaciones nuevas
  const findOption = useCallback(
    (val: string | number) =>
      internalOptions.find((opt) => opt.value.toString() === val.toString()),
    [internalOptions]
  );

  const handleChange = useCallback(
    (newValue: unknown) => {
      if (isMulti) {
        const arr = (newValue as OptionFormT[]) ?? [];
        const newVal = arr.map((opt) => opt.value.toString());
        setFieldValue(name, newVal);
        onChangeValue?.(newVal, setFieldValue);
      } else {
        const opt = newValue as OptionFormT | null;
        const newVal = opt ? opt.value.toString() : null;
        setFieldValue(name, newVal);
        onChangeValue?.(newVal ?? '', setFieldValue);
      }
    },
    [isMulti, name, onChangeValue, setFieldValue]
  );

  useEffect(() => {
    if (!currentValue) {
      setSelectedOption(null);
      return;
    }

    if (isMulti && Array.isArray(currentValue)) {
      const sel = currentValue
        .map((v) => findOption(v))
        .filter((o): o is OptionFormT => !!o);
      setSelectedOption(sel);
    } else if (!isMulti && typeof currentValue === 'string') {
      const opt = findOption(currentValue);
      if (opt) setSelectedOption(opt);
      else if (typeSelect === 'selectCreate')
        setSelectedOption({ label: currentValue, value: currentValue });
    }
  }, [currentValue, findOption, isMulti, typeSelect]);

  const SelectComponent =
    typeSelect === 'selectCreate' ? CreatableSelect : Select;

  return (
    <SelectComponent
      className="basic-single"
      classNamePrefix="select"
      isClearable={isClearable}
      isDisabled={isDisabled}
      isSearchable={isSearchable}
      isMulti={isMulti}
      menuPortalTarget={document.body}
      name={name}
      onChange={handleChange}
      options={internalOptions}
      placeholder={placeholder}
      styles={customStyles}
      value={selectedOption}
      onCreateOption={(inputValue: string) => {
        const newOption: OptionFormT = {
          label: inputValue,
          value: inputValue.toLowerCase(),
        };
        // 1) Agrega la nueva opción a las internas
        setInternalOptions((prev) => [...prev, newOption]);
        // 2) Llama a handleChange con array u objeto según modo
        if (isMulti) {
          const curr = Array.isArray(selectedOption) ? selectedOption : [];
          handleChange([...curr, newOption]);
        } else {
          handleChange(newOption);
        }
      }}
    />
  );
}
