import { letraCapital, letraCapitalInicial } from "./utils.utils";

const unidades: string[] = ['cero', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve'];
const decenas: string[] = ['', '', 'veinte', 'treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'];
const especiales: string[] = ['diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve'];
const centenas: string[] = ['', 'cien', 'doscientos', 'trescientos', 'cuatrocientos', 'quinientos', 'seiscientos', 'setecientos', 'ochocientos', 'novecientos'];

// Método para convertir números a palabras
function convertToWords(num: number): string {
    if (num < 10) {
        return unidades[num];
    } else if (num >= 10 && num < 20) {
        return especiales[num - 10];
    } else if (num >= 20 && num < 100) {
        const unidad = num % 10;
        const decena = Math.floor(num / 10);
        return decenas[decena] + (unidad > 0 ? ' y ' + unidades[unidad] : '');
    } else if (num >= 100 && num < 1000) {
        const centena = Math.floor(num / 100);
        const resto = num % 100;
        return (centena === 1 && resto === 0) ? 'cien' : centenas[centena] + (resto > 0 ? ' ' + convertToWords(resto) : '');
    } else if (num >= 1000 && num < 1000000) {
        return convertirMiles(num);
    }
    return '';
}

// Método para manejar miles
function convertirMiles(num: number): string {
    const miles = Math.floor(num / 1000);
    const resto = num % 1000;
    const milesTexto = miles === 1 ? 'mil' : convertToWords(miles) + ' mil';
    return milesTexto + (resto > 0 ? ' ' + convertToWords(resto) : '');
}

// Método principal
export function     numeroALetras(cantidad: number): string {
    const entero = Math.floor(cantidad); // Parte entera
    const decimal = Math.round((cantidad - entero) * 100); // Parte decimal

    const literalEntero = convertToWords(entero);
    const literalDecimal = decimal.toString().padStart(2, '0');

    return letraCapitalInicial(literalEntero) + ' con ' + literalDecimal + '/100'; // Devolver con decimales
}