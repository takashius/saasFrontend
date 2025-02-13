export const colorPalette = {
  blue: {
    bg: 'bg-blue-600',
    text: 'text-white',
    link: 'text-blue-600',
    hover: 'hover:bg-blue-700',
    menuActive: 'bg-blue-700',
  },
  indigo: {
    bg: 'bg-indigo-600',
    text: 'text-white',
    link: 'text-indigo-600',
    hover: 'hover:bg-indigo-700',
    menuActive: 'bg-indigo-700',
  },
  purple: {
    bg: 'bg-purple-600',
    text: 'text-white',
    link: 'text-purple-600',
    hover: 'hover:bg-purple-700',
    menuActive: 'bg-purple-700',
  },
  pink: {
    bg: 'bg-pink-600',
    text: 'text-white',
    link: 'text-pink-600',
    hover: 'hover:bg-pink-700',
    menuActive: 'bg-pink-700',
  },
  red: {
    bg: 'bg-red-600',
    text: 'text-white',
    link: 'text-red-600',
    hover: 'hover:bg-red-700',
    menuActive: 'bg-red-700',
  },
  orange: {
    bg: 'bg-orange-600',
    text: 'text-white',
    link: 'text-orange-600',
    hover: 'hover:bg-orange-700',
    menuActive: 'bg-orange-700',
  },
  yellow: {
    bg: 'bg-yellow-600',
    text: 'text-white',
    link: 'text-yellow-600',
    hover: 'hover:bg-yellow-700',
    menuActive: 'bg-yellow-700',
  },
  green: {
    bg: 'bg-green-600',
    text: 'text-white',
    link: 'text-green-600',
    hover: 'hover:bg-green-700',
    menuActive: 'bg-green-700',
  },
  teal: {
    bg: 'bg-teal-600',
    text: 'text-white',
    link: 'text-teal-600',
    hover: 'hover:bg-teal-700',
    menuActive: 'bg-teal-700',
  },
  cyan: {
    bg: 'bg-cyan-600',
    text: 'text-white',
    link: 'text-cyan-600',
    hover: 'hover:bg-cyan-700',
    menuActive: 'bg-cyan-700',
  },
  gray: {
    bg: 'bg-gray-600',
    text: 'text-white',
    link: 'text-gray-600',
    hover: 'hover:bg-gray-700',
    menuActive: 'bg-gray-700',
  },
};

export const getColorFromLocalStorage = () => {
  const savedColor = localStorage.getItem('webColor') || 'blue';
  return colorPalette[savedColor as keyof typeof colorPalette];
};