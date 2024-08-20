import { Router } from "@angular/router";

export function goMantenimiento(router: Router) {
    router.navigate(['admin/mantenimiento']);
}

export function goMantenimientoColor(router: Router) {
    router.navigate(['admin/mantenimiento/color']);
}

export function goMantenimientoTalla(router: Router) {
    router.navigate(['admin/mantenimiento/talla']);
}