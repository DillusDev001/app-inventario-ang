export interface ColorShades {
    [shade: number]: string; 
}

export interface Colors {
    inherit: ColorShades;
    current: ColorShades;
    transparent: ColorShades;
    black: ColorShades;
    white: ColorShades;


    gray: ColorShades;
    red: ColorShades;
    yellow: ColorShades;
    blue: ColorShades;
    // Puedes agregar más colores aquí
}

export const colors: Colors = {
    inherit: {
        50: 'inherit'
    },
    current: {
        50: 'currentColor'
    },
    transparent: {
        50: 'transparent'
    },
    black: {
        50: '#000'
    },
    white: {
        50: '#fff'
    },

    gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
        950: '#030712',
    },
    red: {
        50: '#fef2f2',
        100: '#fee2e2',
        200: '#fecaca',
        300: '#fca5a5',
        400: '#f87171',
        500: '#ef4444',
        600: '#dc2626',
        700: '#b91c1c',
        800: '#991b1b',
        900: '#7f1d1d',
        950: '#450a0a',
    },
    yellow: {
        50: '#fefce8',
        100: '#fef9c3',
        200: '#fef08a',
        300: '#fde047',
        400: '#facc15',
        500: '#eab308',
        600: '#ca8a04',
        700: '#a16207',
        800: '#854d0e',
        900: '#713f12',
        950: '#422006',
    },
    blue: {
        50: '#eff6ff',
        100: '#dbeafe',
        200: '#bfdbfe',
        300: '#93c5fd',
        400: '#60a5fa',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
        900: '#1e3a8a',
        950: '#172554',
    }
}
