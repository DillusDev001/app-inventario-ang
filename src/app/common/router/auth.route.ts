import { Router } from "@angular/router";

export function goLogin(router: Router) {
    router.navigate(['']);
}

export function goForGot(router: Router) {
    router.navigate(['forgot']);
}

export function goShared(router: Router) {
    router.navigate(['/shared']);
}