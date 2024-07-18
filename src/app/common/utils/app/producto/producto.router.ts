import { Router } from "@angular/router";

export function goProducto(router: Router) {
    router.navigate(['admin/producto']);
}

export function goProducto_Lista(router: Router) {
    router.navigate(['admin/producto/lista']);
}

export function goProducto_Agregar(router: Router) {
    router.navigate(['admin/producto/agregar']);
}