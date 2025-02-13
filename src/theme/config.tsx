import { ThemeConfig } from "antd";
import { getColorFromLocalStorage } from "./colorPalette"; // Asegúrate de tener la ruta correcta

export const getThemeConfig = (): ThemeConfig => {
  const color = getColorFromLocalStorage();

  // Mapeo de clases de Tailwind a valores hexadecimales
  const colorMap: { [key: string]: string } = {
    'blue-600': '#2563eb',
    'blue-700': '#1d4ed8',
    'indigo-600': '#4f46e5',
    'indigo-700': '#4338ca',
    'purple-600': '#9333ea',
    'purple-700': '#7e22ce',
    'pink-600': '#db2777',
    'pink-700': '#be185d',
    'red-600': '#dc2626',
    'red-700': '#b91c1c',
    'orange-600': '#ea580c',
    'orange-700': '#c2410c',
    'yellow-600': '#ca8a04',
    'yellow-700': '#a16207',
    'green-600': '#16a34a',
    'green-700': '#15803d',
    'teal-600': '#0d9488',
    'teal-700': '#0f766e',
    'cyan-600': '#0891b2',
    'cyan-700': '#0e7490',
    'gray-600': '#4b5563',
    'gray-700': '#374151',
  };

  // Extraer el color principal (ej: 'bg-blue-600' -> 'blue-600')
  const colorKey = color.bg.replace('bg-', '');
  const primaryColor = colorMap[colorKey] || '#2563eb'; // Fallback a blue-600

  return {
    token: {
      colorPrimary: primaryColor,
      colorBgLayout: "#f5f5f5",
      colorBgContainer: "#ffffff",
    },
    components: {
      Button: {
        colorPrimary: primaryColor,
        algorithm: true,
      },
      Switch: {
        colorPrimary: primaryColor,
        algorithm: true,
      },
      Input: {
        colorPrimary: primaryColor,
        algorithm: true,
      },
    }
  };
};