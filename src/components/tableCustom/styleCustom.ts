export function styleCustom(color: string) {
  if (!color) {
    return '';
  }

  if (color === 'secondary') {
    return 'bg-gray-500 text-white hover:bg-gray-700 ';
  }

  if (color === 'info') {
    return 'bg-green-600 text-white hover:bg-green-700 ';
  }

  if (color === 'danger') {
    return 'bg-red-500 text-white hover:bg-red-700 ';
  }

  return 'bg-blue-500 text-white hover:bg-blue-700 ';
}
