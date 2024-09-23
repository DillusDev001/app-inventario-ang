import { Almacen } from "../../almacen/almacen.interface";
import { Producto } from "../../producto/producto.interface";
import { Sucursal } from "../../sucursal/sucursal.interface";

export interface StockSucursal {

    cod_producto: string;
    id_sucursal: number;
    id_almacen: number;
    cantidad: number;
    fec_mod: string;
    
    sucursal: Sucursal;
    almacen: Almacen;
    producto: Producto

}
