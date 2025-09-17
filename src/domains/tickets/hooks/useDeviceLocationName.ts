import { useMemo } from 'react';
import { useLocationOptions } from './useLocationOptions';

/**
 * Hook: useDeviceLocationName
 * Dado un id (value) de device_location, retorna el nombre/label legible.
 * - Si no encuentra coincidencia, devuelve el id como fallback.
 */
export function useDeviceLocationName(id?: string | null) {
  const { locationOptions, isLoading, error } = useLocationOptions();

  const name = useMemo(() => {
    if (!id) return '';
    const found = locationOptions.find((o) => o.value === id);
    return found?.label ?? id;
  }, [id, locationOptions]);

  return { name, isLoading, error };
}

/**
 * Hook alternativo: retorna un mapper para múltiples ids
 * útil cuando necesitas resolver varios ids en el mismo render.
 */
export function useDeviceLocationNameResolver() {
  const { locationOptions, isLoading, error } = useLocationOptions();

  const getName = useMemo(() => {
    return (id?: string | null) => {
      if (!id) return '';
      const found = locationOptions.find((o) => o.value === id);
      return found?.label ?? id;
    };
  }, [locationOptions]);

  return { getName, isLoading, error };
}
