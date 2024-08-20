import { AbstractControl, ValidationErrors } from "@angular/forms";

export function numberValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value === null || value === undefined || value === '') {
        return null; // Permite el valor vacío para que `Validators.required` se encargue de la validación de obligatoriedad
    }
    return isNaN(value) ? { notNumber: true } : null; // Si no es un número, retorna el error
}