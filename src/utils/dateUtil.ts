import { EMPTY_STRING } from './constants';

//format 09:00:00 30/12/2021
export function formatDate(dateIn: string | undefined | null | Date): string {
  try {
    if (!dateIn) {
      return EMPTY_STRING;
    }
    const date = new Date(dateIn);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds} ${day}/${month}/${year}`;
  } catch (error) {
    console.error(error);
    return '';
  }
}

// add 5 hours to date, format 09:00:00 30/12/2021
export function formatDateToFront(
  dateIn: string | undefined | null | Date
): string {
  try {
    if (!dateIn) {
      return EMPTY_STRING;
    }
    const date = new Date(dateIn);
    date.setHours(date.getHours() + 5);
    return formatDate(date);
  } catch (error) {
    console.error(error);
    return '';
  }
}

export function nowDate(nDays?: number) {
  if (!nDays) {
    return new Date().toISOString().split('T')[0];
  }

  const date = new Date();
  date.setDate(date.getDate() + nDays);
  return date.toISOString().split('T')[0];
}
