import { Alignment } from "pdfmake/interfaces";

export function imageTicketHeader(image64: string) {
    return {
        image: image64,
        width: 200,
        rowSpan: 4,
        alignment: 'center' as Alignment,
    }
}