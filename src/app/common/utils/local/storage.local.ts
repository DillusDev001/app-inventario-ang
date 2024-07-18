import { DataLocalStorage } from "../../interfaces/local/data-local-storage";

const userLoggedItem = 'userLogged';

/********************************************** DataLogged **********************************************/
export function getLocalDataLogged(): DataLocalStorage {
    const data = JSON.parse(localStorage.getItem(userLoggedItem) || 'null') as DataLocalStorage;
    if (data !== null) {
        return data;
    } else {
        return data;
    }
}

export function setLocalDataLogged(data: DataLocalStorage): void {
    localStorage.setItem(userLoggedItem, JSON.stringify(data));
}

export function deleteLocalStorageData(): void {
    localStorage.setItem(userLoggedItem, '');
    localStorage.clear();
}

export function existUserLogged(): boolean {
    const data = JSON.parse(localStorage.getItem(userLoggedItem) || 'null');
    if (data !== null) {
        return true;
    } else {
        return false;
    }
}

export function localStorageLogOut(): boolean{
    deleteLocalStorageData();

    return !existUserLogged();
}
