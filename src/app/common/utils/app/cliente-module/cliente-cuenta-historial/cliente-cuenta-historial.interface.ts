
export interface ClienteCuentaHistorial {

    id_historial: number;
    id_cliente: number;
    tipo: string;
    metodo_cuenta: string;
    monto: number;
    fec_mod: string;
    user_mod: string;

}