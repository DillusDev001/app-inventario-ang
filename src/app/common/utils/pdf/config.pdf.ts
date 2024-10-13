import { Alignment, Margins, PageSize } from "pdfmake/interfaces";

export const pdfStyles = {
    header: {
        fontSize: 20,
        bold: true,
    },
    title: {
        fontSize: 16,
        alignment: 'Center' as Alignment,
        bold: true,
    },
    subTitle: {
        fontSize: 14,
        bold: true,
        alignment: 'left' as Alignment,
    },
    total: {
        fontSize: 12,
        bold: true,
        alignment: 'right' as Alignment,
    },
}

export const pdfTicketPageSize = {
    width: 226.77, // 8 cm en puntos
    height: 'auto', // Altura variable en función del contenido
};

export const pdfTicketPageMargins = [10, 10] as Margins;