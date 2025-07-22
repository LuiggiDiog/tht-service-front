import { useCallback, useEffect, useMemo, useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import type {
  CSSObjectWithLabel,
  GroupBase,
  OptionProps,
  StylesConfig,
} from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { useSettingStore } from '@/domains/settings';

export type ColorOptionT = {
  label: string;
  value: string; // valor hexadecimal
};

interface SelectFieldColorProps {
  options: ColorOptionT[];
  isDisabled?: boolean;
  placeholder?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isMulti?: boolean;
  field: {
    name: string;
    value: ColorOptionT | ColorOptionT[] | null;
  };
  form: {
    setFieldValue: (
      name: string,
      value: ColorOptionT | ColorOptionT[] | null
    ) => void;
  };
  value?: ColorOptionT | ColorOptionT[];
  onChangeValue?: (
    value: ColorOptionT | ColorOptionT[],
    setFieldValue: (
      name: string,
      value: ColorOptionT | ColorOptionT[] | null
    ) => void
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
  darkBorderColor: '#374151',
  lightBorderColor: '#E5E7EB',
  darkInputBackground: '#2D3748',
  lightInputBackground: '#FFFFFF',
};

const DEFAULT_COLORS: ColorOptionT[] = [
  { value: '#FF0000', label: 'Rojo' },
  { value: '#0000FF', label: 'Azul' },
  { value: '#00FF00', label: 'Verde' },
  { value: '#FFFF00', label: 'Amarillo' },
  { value: '#000000', label: 'Negro' },
  { value: '#FFFFFF', label: 'Blanco' },
  { value: '#800080', label: 'Morado' },
  { value: '#FFA500', label: 'Naranja' },
  { value: '#FFC0CB', label: 'Rosa' },
  { value: '#A52A2A', label: 'Marrón' },
  { value: '#808080', label: 'Gris' },
];

// Función para convertir un color hexadecimal a un nombre descriptivo
const getColorName = (hexColor: string): string => {
  // Convertir hex a RGB
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // Función auxiliar para determinar el tono dominante
  const getDominantHue = () => {
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    const delta = max - min;

    if (delta === 0) return 'Gris';

    let hue =
      (() => {
        if (max === r) return ((g - b) / delta) % 6;
        if (max === g) return (b - r) / delta + 2;
        return (r - g) / delta + 4;
      })() * 60;

    if (hue < 0) hue += 360;

    if (hue >= 0 && hue < 30) return 'Rojo';
    if (hue >= 30 && hue < 90) return 'Naranja';
    if (hue >= 90 && hue < 150) return 'Amarillo';
    if (hue >= 150 && hue < 210) return 'Verde';
    if (hue >= 210 && hue < 270) return 'Cian';
    if (hue >= 270 && hue < 330) return 'Azul';
    return 'Magenta';
  };

  // Determinar la intensidad
  const intensity = (r + g + b) / 3;
  const isLight = intensity > 128;
  const isDark = intensity < 64;

  // Determinar la saturación
  const saturation = Math.max(r, g, b) - Math.min(r, g, b);
  const isMuted = saturation < 30;

  let colorName = getDominantHue();

  if (isMuted) colorName = 'Gris ' + colorName.toLowerCase();
  if (isLight) colorName = 'Claro ' + colorName.toLowerCase();
  if (isDark) colorName = 'Oscuro ' + colorName.toLowerCase();

  return colorName;
};

export default function SelectFieldColor({
  options = DEFAULT_COLORS,
  isDisabled = false,
  placeholder = 'Seleccione un color',
  isClearable = false,
  isSearchable = true,
  isMulti = false,
  field: { name, value: fieldValue },
  form: { setFieldValue },
  value: externalValue,
  onChangeValue,
  isBorderless = false,
}: SelectFieldColorProps) {
  const isDarkMode = useSettingStore((state) => state.isDarkMode);
  const generalMode = isDarkMode ? 'dark' : 'light';
  const currentValue = externalValue ?? fieldValue;
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showNameInput, setShowNameInput] = useState(false);
  const [tempColor, setTempColor] = useState('#000000');
  const [tempColorName, setTempColorName] = useState('');
  const [internalOptions, setInternalOptions] =
    useState<ColorOptionT[]>(options);

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

  const customStyles: StylesConfig<
    ColorOptionT,
    boolean,
    GroupBase<ColorOptionT>
  > = useMemo(() => {
    const base: StylesConfig<
      ColorOptionT,
      boolean,
      GroupBase<ColorOptionT>
    > = isBorderless
      ? {
          control: (base: CSSObjectWithLabel) => ({
            ...base,
            border: '0',
            boxShadow: 'none',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
            padding: 0,
            margin: 0,
          }),
          container: (base: CSSObjectWithLabel) => ({
            ...base,
            padding: 0,
            margin: 0,
          }),
          menu: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: getBackgroundColor(),
            width: '200px',
            zIndex: 9999,
          }),
          input: (base: CSSObjectWithLabel) => ({
            ...base,
            color: getTextColor(),
            padding: 0,
            margin: 0,
          }),
          valueContainer: (base: CSSObjectWithLabel) => ({
            ...base,
            padding: 0,
            margin: 0,
          }),
        }
      : {
          control: (base: CSSObjectWithLabel) => ({
            ...base,
            border: `1px solid ${
              generalMode === 'dark'
                ? COLORS.darkBorderColor
                : COLORS.lightBorderColor
            }`,
            borderRadius: '4px',
            padding: '5px',
            backgroundColor: getBackgroundColor(),
            color: getTextColor(),
          }),
          menu: (base: CSSObjectWithLabel) => ({
            ...base,
            backgroundColor: getBackgroundColor(),
            zIndex: 9999,
          }),
          input: (base: CSSObjectWithLabel) => ({
            ...base,
            color: getTextColor(),
          }),
          valueContainer: (base: CSSObjectWithLabel) => base,
        };

    return {
      ...base,
      option: (
        base: CSSObjectWithLabel,
        props: OptionProps<ColorOptionT, boolean, GroupBase<ColorOptionT>>
      ) => ({
        ...base,
        backgroundColor: getBackgroundColor(props.isSelected),
        color: getTextColor(props.isSelected, props.isFocused),
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        '&:before': {
          content: '""',
          width: '16px',
          height: '16px',
          backgroundColor: props.data.value,
          borderRadius: '4px',
          border: `1px solid ${
            generalMode === 'dark'
              ? COLORS.darkBorderColor
              : COLORS.lightBorderColor
          }`,
        },
      }),
      singleValue: (base: CSSObjectWithLabel & { data?: ColorOptionT }) => ({
        ...base,
        color: getTextColor(),
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        '&:before': {
          content: '""',
          width: '16px',
          height: '16px',
          backgroundColor: base.data?.value,
          borderRadius: '4px',
          border: `1px solid ${
            generalMode === 'dark'
              ? COLORS.darkBorderColor
              : COLORS.lightBorderColor
          }`,
        },
      }),
      placeholder: (base: CSSObjectWithLabel) => ({
        ...base,
        color: COLORS.placeholderColor,
      }),
      menuPortal: (base: CSSObjectWithLabel) => ({
        ...base,
        zIndex: 9999,
      }),
    };
  }, [isBorderless, getBackgroundColor, getTextColor, generalMode]);

  const [selectedOption, setSelectedOption] = useState<
    ColorOptionT | ColorOptionT[] | null
  >(null);

  const handleChange = useCallback(
    (newValue: unknown) => {
      if (isMulti) {
        const arr = (newValue as ColorOptionT[]) ?? [];
        setFieldValue(name, arr);
        onChangeValue?.(arr, setFieldValue);
      } else {
        const opt = newValue as ColorOptionT | null;
        setFieldValue(name, opt);
        onChangeValue?.(opt ?? { label: '', value: '' }, setFieldValue);
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
      setSelectedOption(currentValue);
    } else if (!isMulti && typeof currentValue === 'object') {
      setSelectedOption(currentValue as ColorOptionT);
    }
  }, [currentValue, isMulti]);

  const handleCreateOption = (inputValue: string) => {
    // Validar si el input es un color hexadecimal válido
    const isValidHex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(inputValue);
    if (!isValidHex) {
      setTempColor(inputValue);
      setShowColorPicker(true);
      return;
    }

    // Si es un color válido, mostrar el input para el nombre
    setTempColor(inputValue);
    setTempColorName(getColorName(inputValue));
    setShowNameInput(true);
  };

  const handleColorPickerChange = (color: string) => {
    setTempColor(color);
  };

  const handleColorPickerClose = () => {
    setShowColorPicker(false);
    setTempColorName(getColorName(tempColor));
    setShowNameInput(true);
  };

  const handleSaveColor = () => {
    const newOption: ColorOptionT = {
      label: tempColorName.trim() || getColorName(tempColor),
      value: tempColor,
    };
    setInternalOptions((prev) => [...prev, newOption]);

    if (isMulti) {
      const curr = Array.isArray(selectedOption) ? selectedOption : [];
      handleChange([...curr, newOption]);
    } else {
      handleChange(newOption);
    }

    setShowNameInput(false);
    setTempColorName('');
  };

  return (
    <div className="relative">
      <CreatableSelect
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
        onCreateOption={handleCreateOption}
      />
      {showColorPicker && (
        <div
          className={`absolute z-50 mt-2 p-4 rounded-lg shadow-lg border ${
            generalMode === 'dark'
              ? 'bg-[#1E293B] border-[#374151]'
              : 'bg-white border-gray-200'
          }`}
        >
          <HexColorPicker
            color={tempColor}
            onChange={handleColorPickerChange}
          />
          <div className="mt-2 flex justify-end gap-2">
            <button
              className={`px-3 py-1 text-sm rounded ${
                generalMode === 'dark'
                  ? 'bg-[#374151] text-white hover:bg-[#4B5563]'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => setShowColorPicker(false)}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleColorPickerClose}
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
      {showNameInput && (
        <div
          className={`absolute z-50 mt-2 p-4 rounded-lg shadow-lg border ${
            generalMode === 'dark'
              ? 'bg-[#1E293B] border-[#374151]'
              : 'bg-white border-gray-200'
          }`}
        >
          <div className="mb-4">
            <label
              className={`block text-sm font-medium mb-1 ${
                generalMode === 'dark' ? 'text-white' : 'text-gray-700'
              }`}
            >
              Nombre del color
            </label>
            <input
              type="text"
              value={tempColorName}
              onChange={(e) => setTempColorName(e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                generalMode === 'dark'
                  ? 'bg-[#2D3748] border-[#374151] text-white placeholder-gray-400'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
              }`}
              placeholder="Ingrese un nombre para el color"
              autoFocus
            />
            <div className="mt-2 flex items-center gap-2">
              <div
                className="w-6 h-6 rounded border"
                style={{
                  backgroundColor: tempColor,
                  borderColor:
                    generalMode === 'dark'
                      ? COLORS.darkBorderColor
                      : COLORS.lightBorderColor,
                }}
              />
              <span
                className={`text-sm ${
                  generalMode === 'dark' ? 'text-gray-400' : 'text-gray-500'
                }`}
              >
                {tempColor}
              </span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <button
              className={`px-3 py-1 text-sm rounded ${
                generalMode === 'dark'
                  ? 'bg-[#374151] text-white hover:bg-[#4B5563]'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
              onClick={() => {
                setShowNameInput(false);
                setTempColorName('');
              }}
            >
              Cancelar
            </button>
            <button
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={handleSaveColor}
            >
              Guardar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
