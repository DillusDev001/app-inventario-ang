import { Usuario } from "../usuario/usuario.interface";

export interface Sucursal {

    id_sucursal: number;
    nombre: string;
    direccion: string;
    telefono: string;
    usuario_encargado: string;
    descripcion: string;
    estado: number;

    encargado: Usuario;

}
