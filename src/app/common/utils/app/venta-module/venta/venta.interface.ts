export interface Venta {

    id_venta: number;
    talonario_proforma: string;
    nro_proforma: string;
    fec_venta: string;

    costo_total: number;
    descuento: number;

    costo_pagar: number;
    user_venta: string;
    nro_factura: string;

}
