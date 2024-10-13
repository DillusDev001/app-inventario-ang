import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment, Margins, PageSize } from "pdfmake/interfaces";
import { pdfStyles, pdfTicketPageMargins, pdfTicketPageSize } from "../config.pdf";
import { ClienteCuentaHistorial } from "../../app/cliente-module/cliente-cuenta-historial/cliente-cuenta-historial.interface";
import { Cliente } from "../../app/cliente-module/cliente/cliente.interface";
import { Usuario } from "../../app/usuario/usuario.interface";
import { guionTicket } from "../text-ticket";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function pdfTicketComprobante(cliente: Cliente, item: ClienteCuentaHistorial, user: Usuario, type: string,) {

    var pdfCreation = {
        pageSize: pdfTicketPageSize as PageSize,
        pageMargins: pdfTicketPageMargins,
        content: [
            { text: 'COMPROBANTE DE ' + item.tipo.toUpperCase(), style: 'header', alignment: 'center' as Alignment },
            { text: guionTicket, alignment: 'center' as Alignment },
            {
                text: 'Fecha: ' + new Date().toLocaleString(),
            },
            { text: '------------------------------' },
            {
                text: 'Descripción\n Tamaño: 226.77 -> 8 cm en puntos',
                bold: true,
            },
        ],
        styles: pdfStyles,
        defaultStyle: {
            fontSize: 10,
        },
    }

    switch (type) {
        case 'descargar':
            pdfMake.createPdf(pdfCreation).download('objCotizacionFRX.cod_cotizacion' + '.pdf');
            break;

        case 'imprimir':
            pdfMake.createPdf(pdfCreation).open();
            break;
    }
}

/*printTicket() {
    // Define the document structure
    const docDefinition = {
      pageSize: pdfPageSize as PageSize,
      pageMargins: pdfPageMargins,
      content: [
        { text: 'Ticket de Venta', style: 'header', alignment: 'center' as Alignment },
        { text: '------------------------------' },
        {
          text: 'Fecha: ' + new Date().toLocaleString(),
        },
        { text: '------------------------------' },
        {
          text: 'Descripción\n Tamaño: 226.77 -> 8 cm en puntos',
          bold: true,
        },
        {
          ol: [
            'Producto 1 - $10.00',
            'Producto 2 - $15.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
            'Producto 3 - $20.00',
          ],
        },
        { text: '------------------------------' },
        {
          text: 'Total: $45.00',
          style: 'total',
        },
      ],
      styles: pdfStyles,
      defaultStyle: {
        fontSize: 12,
      },
    };

    // Generar el PDF y abrir la vista previa
    pdfMake.createPdf(docDefinition).open();
  }*/