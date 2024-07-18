import { Router } from "@angular/router";

export function goUsuario(router: Router) {
    router.navigate(['admin/usuario']);
}

export function goUsuario_Lista(router: Router) {
    router.navigate(['admin/usuario/lista']);
}

export function goUsuario_Agregar(router: Router) {
    router.navigate(['admin/usuario/agregar']);
}