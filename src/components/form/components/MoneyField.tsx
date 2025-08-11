import { useCallback, useEffect, useState } from 'react';

interface MoneyFieldProps {
  field: {
    name: string;
    value: number | string;
  };
  form: {
    setFieldValue: (name: string, value: number) => void;
  };
  placeholder?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  className?: string;
}

// Función para formatear número a moneda usando mejores prácticas
const formatCurrency = (value: number): string => {
  if (isNaN(value) || value === 0) return '';

  // Usar Intl.NumberFormat para formateo robusto de dólares
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  return formatter.format(value);
};

// Función para limpiar y parsear entrada de usuario
const parseValue = (text: string): number => {
  // Remover todo excepto números y puntos decimales
  let cleanText = text.replace(/[^\d.]/g, '');

  // Manejar múltiples puntos: conservar solo el primero
  const parts = cleanText.split('.');
  if (parts.length > 2) {
    cleanText = parts[0] + '.' + parts.slice(1).join('');
  }

  // Limitar a 2 decimales máximo
  if (parts.length === 2 && parts[1].length > 2) {
    cleanText = parts[0] + '.' + parts[1].substring(0, 2);
  }

  const parsed = parseFloat(cleanText);
  return isNaN(parsed) ? 0 : parsed;
};

export default function MoneyField({
  field: { name, value },
  form: { setFieldValue },
  placeholder = '0.00',
  disabled = false,
  min = 0,
  max = 999999999.99,
  className = '',
}: MoneyFieldProps) {
  const [displayValue, setDisplayValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Sincronizar el valor del formulario con el display
  useEffect(() => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (!isFocused && numValue > 0) {
      setDisplayValue(formatCurrency(numValue));
    } else if (!isFocused && (numValue === 0 || isNaN(numValue))) {
      setDisplayValue('');
    }
  }, [value, isFocused]);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (numValue > 0) {
      setDisplayValue(numValue.toString());
    } else {
      setDisplayValue('');
    }
  }, [value]);

  const handleBlur = useCallback(() => {
    setIsFocused(false);
    const parsedValue = parseValue(displayValue);
    // Aplicar límites mínimo y máximo
    const finalValue = Math.min(Math.max(parsedValue, min), max);

    setFieldValue(name, finalValue);

    if (finalValue > 0) {
      setDisplayValue(formatCurrency(finalValue));
    } else {
      setDisplayValue('');
    }
  }, [displayValue, name, setFieldValue, min, max]);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;

      if (isFocused) {
        // Aplicar limpieza y validación en tiempo real
        const cleanedValue = parseValue(inputValue).toString();
        const parsed = parseFloat(cleanedValue);

        // Verificar límites solo visualmente (no aplicar hasta blur)
        if (!isNaN(parsed) && parsed <= max) {
          setDisplayValue(inputValue.replace(/[^\d.]/g, ''));
        } else if (inputValue === '') {
          setDisplayValue('');
        }
      }
    },
    [isFocused, max]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      // Permitir teclas especiales
      if (
        e.key === 'Backspace' ||
        e.key === 'Delete' ||
        e.key === 'Tab' ||
        e.key === 'Enter' ||
        e.key === 'ArrowLeft' ||
        e.key === 'ArrowRight' ||
        (e.key === '.' && !displayValue.includes('.'))
      ) {
        return;
      }

      // Solo permitir números
      if (!/^\d$/.test(e.key)) {
        e.preventDefault();
      }
    },
    [displayValue]
  );

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={disabled}
      autoComplete="off"
      className={className}
    />
  );
}
