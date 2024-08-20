import { Usuario } from "../usuario/usuario.interface";

export interface Almacen {

    id_almacen: number;
    id_sucursal: number;
    nombre: string;
    direccion: string;
    telefono: string;
    descripcion: string;
    usuario_encargado: string;
    estado: number;

    encargado: Usuario;
    
}
