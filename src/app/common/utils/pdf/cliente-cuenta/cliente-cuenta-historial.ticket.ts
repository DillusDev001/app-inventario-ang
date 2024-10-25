import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment, Margins, PageSize } from "pdfmake/interfaces";
import { pdfStyles, pdfTicketPageMargins, pdfTicketPageSize } from "../config.pdf";
import { ClienteCuentaHistorial } from "../../app/cliente-module/cliente-cuenta-historial/cliente-cuenta-historial.interface";
import { Cliente } from "../../app/cliente-module/cliente/cliente.interface";
import { Usuario } from "../../app/usuario/usuario.interface";
import { graciasPreferenciaText, guionTicket, lineaFirma } from "../text-ticket";
import { formatDate } from "@angular/common";
import { numeroALetras } from "../../local/convertNumberToWords";
import { formatoBsMonto, formatoMonto, letraCapitalInicial } from "../../local/utils.utils";
import { imageTicketHeader } from "../static.pdf";
import { ClienteCuenta } from "../../app/cliente-module/cliente-cuenta/cliente-cuenta.interface";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function pdfTicketComprobante(cliente: Cliente, cuenta: ClienteCuenta, item: ClienteCuentaHistorial, user: Usuario, type: string, image64: string) {

    var pdfCreation = {
        pageSize: pdfTicketPageSize as PageSize,
        pageMargins: pdfTicketPageMargins,
        content: [
            { text: '\n' },
            imageTicketHeader(image64),
            { text: '\n' },
            { text: guionTicket, alignment: 'center' as Alignment },
            { text: 'COMPROBANTE DE ' + item.tipo.toUpperCase(), style: 'title', alignment: 'center' as Alignment },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                table: {
                    widths: ['25%', 'auto', '*'],
                    body: [
                        [
                            { text: 'Cliente', bold: true, margin: [0, 0, 0, -5] },
                            { text: ':', bold: true, alignment: 'center' as Alignment, margin: [-5, 0, 0, -5] },
                            { text: cliente.cliente, alignment: 'left' as Alignment, margin: [0, 0, 0, -5] },
                        ],
                        [
                            { text: 'Fecha', bold: true, margin: [0, 0, 0, -5] },
                            { text: ':', bold: true, alignment: 'center' as Alignment, margin: [-5, 0, 0, -5] },
                            { text: formatDate(item.fec_mod, 'dd/MM/yyyy HH:mm', 'es'), alignment: 'left' as Alignment, margin: [0, 0, 0, -5] },
                        ],
                        [
                            { text: 'Moneda', bold: true, margin: [0, 0, 0, 0] },
                            { text: ':', bold: true, alignment: 'center' as Alignment, margin: [-5, 0, 0, 0] },
                            { text: 'BOLIVIANOS', alignment: 'left' as Alignment, margin: [0, 0, 0, 0] },
                        ],
                    ]
                },
                layout: {
                    defaultBorder: false
                }
            },
            { text: guionTicket, alignment: 'center' as Alignment },
            { text: 'DETALLE', bold: true, alignment: 'center' as Alignment },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                table: {
                    widths: ['15%', 'auto', '*', 'auto'],
                    margin: [0, 0, 0, 0] as Margins,
                    body: [
                        [
                            { text: 'Cant', bold: true, alignment: 'center' as Alignment },
                            { text: 'Tipo', bold: true, alignment: 'center' as Alignment },
                            { text: 'Método', bold: true, alignment: 'center' as Alignment },
                            { text: 'Monto', bold: true, alignment: 'center' as Alignment },
                        ],
                    ]
                },
                layout: {
                    defaultBorder: false
                },
                margin: [0, -5] as Margins
            },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                table: {
                    widths: ['15%', 'auto', '*', 'auto'],
                    margin: [0, 0, 0, 0] as Margins,
                    body: [
                        [
                            { text: '1', alignment: 'center' as Alignment },
                            { text: letraCapitalInicial(item.tipo), alignment: 'center' as Alignment },
                            { text: item.metodo_cuenta, alignment: 'center' as Alignment },
                            { text: formatoMonto(item.monto), alignment: 'center' as Alignment },
                        ],
                    ]
                },
                layout: {
                    defaultBorder: false
                }
            },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                table: {
                    widths: ['25%', 'auto', '*', '*'],
                    margin: [0, 0, 0, 0] as Margins,
                    body: [
                        [
                            { text: 'Total Bs.', bold: true, margin: [0, 0, -5, 0] as Margins },
                            { text: ':', bold: true },
                            { text: formatoMonto(item.monto), colSpan: 2, alignment: 'right' as Alignment },
                            { text: '' },
                        ],
                        [
                            { text: 'Son', bold: true, margin: [0, 0, -5, 0] as Margins },
                            { text: ':', bold: true },
                            { text: numeroALetras(item.monto) + ' BOLIVIANOS', colSpan: 2, alignment: 'left' as Alignment },
                            { text: '' },
                        ],
                    ]
                },
                layout: {
                    defaultBorder: false
                }
            },
            { text: guionTicket, alignment: 'center' as Alignment },
            { text: '\n\n\n\n' },
            { text: lineaFirma, alignment: 'center' as Alignment },
            { text: 'Conformidad', alignment: 'center' as Alignment },
            { text: '\n' },
            { text: guionTicket, alignment: 'center' as Alignment },
            { text: 'CUENTA', bold: true, alignment: 'center' as Alignment },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                table: {
                    widths: ['25%', 'auto', '*'],
                    body: [
                        [
                            { text: 'Monto', bold: true, margin: [0, 0, 0, -5] },
                            { text: ':', bold: true, alignment: 'center' as Alignment, margin: [-5, 0, 0, -5] },
                            { text: formatoBsMonto(cuenta.monto), alignment: 'left' as Alignment, margin: [0, 0, 0, -5] },
                        ],
                        [
                            { text: 'Fecha', bold: true, margin: [0, 0, 0, -5] },
                            { text: ':', bold: true, alignment: 'center' as Alignment, margin: [-5, 0, 0, -5] },
                            { text: formatDate(cuenta.fec_mod, 'dd/MM/yyyy HH:mm', 'es'), alignment: 'left' as Alignment, margin: [0, 0, 0, -5] },
                        ],
                        [
                            { text: 'Usuario', bold: true, margin: [0, 0, 0, 0] },
                            { text: ':', bold: true, alignment: 'center' as Alignment, margin: [-5, 0, 0, 0] },
                            { text: cuenta.user_mod, alignment: 'left' as Alignment, margin: [0, 0, 0, 0] },
                        ],
                    ]
                },
                layout: {
                    defaultBorder: false
                }
            },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                text: [
                    { text: 'Fue atendido por: ', bold: true },
                    { text: item.user_mod }
                ]
            },
            { text: guionTicket, alignment: 'center' as Alignment },
            { text: graciasPreferenciaText, alignment: 'center' as Alignment, bold: true },
            { text: guionTicket, alignment: 'center' as Alignment },

        ],
        styles: pdfStyles,
        defaultStyle: {
            fontSize: 10,
        },
    }

    switch (type) {
        case 'descargar':
            pdfMake.createPdf(pdfCreation).download('cliente - ' + cliente.nit + '.pdf');
            break;

        case 'imprimir':
            pdfMake.createPdf(pdfCreation).open();
            break;
    }
}