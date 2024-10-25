import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { pdfStyles, pdfTicketPageMargins, pdfBarCodeProducto } from "../config.pdf";
import { Alignment, Margins, PageSize } from "pdfmake/interfaces";
import { Producto } from "../../app/producto/producto.interface";

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

export function pdfProductoCBarCode(producto: Producto, type: string, barcode: string){

    var pdfCreation = {
        pageSize: pdfBarCodeProducto as PageSize,
        pageMargins: [0, 0] as Margins,
        content: [
            {
              image: barcode,
              width: 120,
              alignment: 'center' as Alignment
            },
        ],
        styles: pdfStyles,
        defaultStyle: {
            fontSize: 10,
        },
    }

    switch (type) {
        case 'descargar':
            pdfMake.createPdf(pdfCreation).download(producto.cod_producto + '.pdf');
            break;

        case 'imprimir':
            pdfMake.createPdf(pdfCreation).open();
            break;
    }
}