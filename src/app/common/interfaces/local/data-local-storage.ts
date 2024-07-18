import { Usuario } from "../../utils/app/usuario/usuario.interface";

export interface DataLocalStorage {
    usuario: Usuario | null;
    loggedDate: String;
}
