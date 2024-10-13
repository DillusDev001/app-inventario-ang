import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { Venta } from 'src/app/common/utils/app/venta-module/venta/venta.interface';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { numberValidator } from 'src/app/common/utils/local/validators.local';

import { Result } from '@zxing/library';

import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
import { Alignment, Margins, PageSize } from 'pdfmake/interfaces';
import { pdfTicketPageMargins, pdfTicketPageSize, pdfStyles } from 'src/app/common/utils/pdf/config.pdf';

(<any>pdfMake).vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-add-venta',
  templateUrl: './add-venta.component.html',
  styleUrls: ['./add-venta.component.css']
})
export class AddVentaComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService
  ) {
    if (getLocalDataLogged() != null) {
      this.dataLocalStorage = getLocalDataLogged();
      if (this.dataLocalStorage.usuario != null) {
        this.userLogeado = this.dataLocalStorage.usuario;
      } else {
        deleteLocalStorageData();
        goLogin(this.router);
      }
    } else {
      deleteLocalStorageData();
      goLogin(this.router);
    }
  }

  /** ---------------------------------------- OnInit ----------------------------------------- **/
  ngOnInit(): void {
    //initFlowbite();
    this.isOnline = this.networkStatusService.isOnline;
    this.networkStatusService.isOnline$.subscribe(status => {
      this.isOnline = status;
    });

    switch (this.type) {
      case 'agregar':
        this.title = 'Agregar Venta';
        break;

      case 'editar':
        this.title = 'Editar Venta';
        break;

      case 'ver':
        this.title = 'Venta';
        break;
    }
  }

  /** ---------------------------------- Variables de Inicio ---------------------------------- **/
  // ================ INICIO ================ //
  isOnline!: boolean;

  // Data Local Storeage - Variable
  dataLocalStorage: DataLocalStorage = {
    usuario: null,
    loggedDate: ''
  }

  // Usuario logeado
  userLogeado!: Usuario;

  // loading spinner
  isLoading: boolean = false;

  // Confirmacion
  showConfirmation: boolean = false;

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  formCompra = new FormGroup({
    id_venta: new FormControl('000001', [Validators.required]),
    talonario_proforma: new FormControl('', [Validators.required]),
    nro_proforma: new FormControl('', [Validators.required]),
    fec_venta: new FormControl('', [Validators.required]),
    costo_total: new FormControl('', [Validators.required, numberValidator()]),
    descuento: new FormControl('', [Validators.required, numberValidator()]),
    costo_pagar: new FormControl('', [Validators.required, numberValidator()]),
    user_venta: new FormControl('', [Validators.required]),
    nro_factura: new FormControl('', [Validators.required]),
  });

  title: string = '';

  @Input() venta!: Venta;
  @Input() type!: string;

  @Output() response: EventEmitter<any> = new EventEmitter();


  // \
  /** ---------------------------------------- Methods ---------------------------------------- **/
  printTicket() {
    // Define the document structure
    const docDefinition = {
      pageSize: pdfTicketPageSize as PageSize,
      pageMargins: pdfTicketPageMargins,
      content: [
        { text: 'INNER', style: 'header', alignment: 'center' as Alignment },
        {
          text: [
            { text: 'Fecha de emisión: ', bold: true }, '27/09/2024, 16:33:47\n',
            { text: 'Cliente: ', bold: true }, 'Diego Junior Llusco Chui\n',
            { text: 'NIT/CI: ', bold: true }, '1231221\n',
            ''
          ],
          margin: [0, 0, 0, 5,] as Margins
        },
        { text:'\n'},
        {
          table: {
            widths: ['15%', '*', '20%', '20%'],
            margin: [0, 0, 0, 5,] as Margins,
            body: [
              [
                { text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', alignment: 'center' as Alignment, colSpan: 4 },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              [
                { text: 'CANT'},
                { text: 'DESCRIPCIÓN'},
                { text: 'P.U.'},
                { text: 'SUB'},
              ],
              [
                { text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', alignment: 'center' as Alignment, colSpan: 4 },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              // Datos
              [
                { text: '2', alignment: 'center' as Alignment },
                { text: '0001-AP5323 - Gorra - L - Amarillo Patito', colSpan: 3},
                { text: ''},
                { text: ''},
              ],
              [
                { text: '',  },
                { text: '',},
                { text: '100.0'},
                { text: '200.00'},
              ],

              [
                { text: '1', alignment: 'center' as Alignment },
                { text: '0001-AP5323 - Gorra - L - Amarillo Patito', colSpan: 3},
                { text: ''},
                { text: ''},
              ],
              [
                { text: '',  },
                { text: '',},
                { text: '100.0'},
                { text: '100.00'},
              ],
              [
                { text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', alignment: 'center' as Alignment, colSpan: 4 },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              // Total
              [
                { text: '',  },
                { text: 'Total :', colSpan: 2},
                { text: ''},
                { text: '300.00'},
              ],
              // Descuento
              [
                { text: '',  },
                { text: 'Descuento :', colSpan: 2},
                { text: ''},
                { text: '10.00'},
              ],
              // Total Pagar
              [
                { text: '',  },
                { text: 'Total a pagar :', colSpan: 2},
                { text: ''},
                { text: '290.00'},
              ],
              [
                { text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', alignment: 'center' as Alignment, colSpan: 4 },
                { text: '' },
                { text: '' },
                { text: '' },
              ],
              // Total literal
              [
                { text: 'Son: Trecientos bolivianos 00/100', colSpan: 4  },
                { text: ''},
                { text: ''},
                { text: ''},
              ],
            ],
          },
          layout: {
            defaultBorder: false, // Sin bordes
            paddingLeft: function() { return 0; }, // Aplicar padding izquierdo
            paddingRight: function() { return 0; }, // Aplicar padding derecho
            paddingTop: function() { return -10; }, // Aplicar padding superior negativo
            paddingBottom: function() { return 8; }, // Aplicar padding inferior
          },
        },
        { text: 'Cant. Prods: 2' },
        { text: 'Vendedor: Anahí Ortega Apaza' },
        { text:'\n'},
        { text: '- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -', alignment: 'center' as Alignment},
        { text: 'GRACIAS POR SU COMPRA', alignment: 'center' as Alignment },
      ],
<<<<<<< HEAD
      styles: pdfStyles,
=======
      styles: {
        header: {
          fontSize: 44,
          bold: true,
        },
        total: {
          fontSize: 12,
          bold: true,
          alignment: 'right' as Alignment,
        },
      },
>>>>>>> 6dafa44dac2d844fa62e884fd74da0fca698291d
      defaultStyle: {
        fontSize: 10,
      },
    };

    // Generar el PDF y abrir la vista previa
    pdfMake.createPdf(docDefinition).open();
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    this.printTicket();
  }

  onClickCancelar() { }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onReciveResponseConfirmation(event: ResponseEmitter) {
    if (event.bool) {
      this.showConfirmation = false;
      this.isLoading = true;
      //this.stockSucursalAgregarMultiple();
    } else {
      this.customErrorToast('Cancelado!!!');
      this.showConfirmation = false;
    }
  }

  agregarArticulo(event: any) {
    const codigoBarra = event.target.value;
    // Lógica para buscar el artículo en la base de datos y agregarlo a la lista
    console.log("Código de barras escaneado: ", codigoBarra);
  }

  /** --------------------------------------- ShowAlerts -------------------------------------- **/
  customSuccessToast(msg: string) {
    this.toast.success(msg, {
      duration: 2000,
      position: 'bottom-right',
      style: {
        border: '1px solid #2e798c',
        padding: '16px',
        color: '#2b6273',
      },
      iconTheme: {
        primary: '#3494a6',
        secondary: '#FFFAEE',
      },
    });
  }

  customErrorToast(msg: string) {
    this.toast.error(msg, {
      duration: 2000,
      position: 'bottom-right',
      style: {
        border: '1px solid #ef445f',
        padding: '16px',
        color: '#ef445f',
      },
      iconTheme: {
        primary: '#ef445f',
        secondary: '#FFFAEE',
      },
    });
  }

  customLoadingToast(msg: string) {
    this.toast.loading(msg, {
      duration: 10000,
      position: 'top-right',
      style: {
        border: '1px solid #2b59c3',
        padding: '16px',
        color: '#2b59c3',
      },
      iconTheme: {
        primary: '#2b59c3',
        secondary: '#FFFAEE',
      },
    });
  }

  hasDevices: boolean = false;
  hasPermission: boolean = true;
  scannedResult: string | null = null;

  handleQrCodeResult(result: any) {
    result as Result;
    this.scannedResult = result.getText();
    console.log('Scanned Result:', this.scannedResult);
  }


}
