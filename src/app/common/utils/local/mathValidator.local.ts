import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function mathExpressionValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    
    // Verifica si el valor contiene caracteres no permitidos
    if (!/^[0-9+\-*/\s]+$/.test(value)) {
      return { invalidCharacters: true };
    }
    
    try {
      // Evalúa la expresión
      const result = eval(value);

      // Verifica si el resultado es un número
      if (isNaN(result)) {
        return { invalidExpression: true };
      }
      
      return null; // No hay errores
    } catch (error) {
      // Error en la evaluación de la expresión
      return { invalidExpression: true };
    }
  };
}