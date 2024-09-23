import { Producto } from "../../producto/producto.interface";

export interface StockGeneral {

    cod_producto: string;
    cantidad: number;
    fec_mod: string;
    producto: Producto;
}
