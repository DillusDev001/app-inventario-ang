import { AbstractControl, ValidationErrors } from "@angular/forms";

export function numberValidator(maxValue?: number) {
    return (control: AbstractControl): ValidationErrors | null => {
        const value = control.value;

        // Verifica si el valor es null o undefined
        if (value === null || value === undefined) {
            return null; // Permite el valor vacío para que `Validators.required` se encargue de la validación de obligatoriedad
        }

        // Asegúrate de que el valor sea una cadena
        const valueStr = String(value).trim();

        // Verifica si el valor es una cadena vacía después de trim()
        if (valueStr === '') {
            return null; // Permite el valor vacío para que `Validators.required` se encargue de la validación de obligatoriedad
        }

        // Verifica si el valor contiene caracteres no permitidos
        if (!/^[0-9+\-*/\s.]+$/.test(value)) {
            return { invalidCharacters: true };
        }

        try {
            // Evalúa la expresión
            const result = eval(value);

            // Verifica si el resultado es un número
            if (isNaN(result)) {
                return { notNumber: true };
            }

            // Verifica si el resultado excede el valor máximo permitido
            if (maxValue !== undefined && result > maxValue) {
                return { max: { maxValue: maxValue, actual: result } };
            }

            return null; // La entrada es un número válido o una expresión que se evalúa a un número
        } catch (error) {
            // Error en la evaluación de la expresión
            return { notNumber: true };
        }
    };
}