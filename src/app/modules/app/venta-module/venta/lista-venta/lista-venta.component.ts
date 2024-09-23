import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { Venta } from 'src/app/common/utils/app/venta-module/venta/venta.interface';
import { arrayBusquedaVenta } from 'src/app/common/utils/local/arrays/busqueda.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-lista-venta',
  templateUrl: './lista-venta.component.html',
  styleUrls: ['./lista-venta.component.css']
})
export class ListaVentaComponent implements OnInit {
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
  formBusqueda = new FormGroup({
    busqueda: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  dataBusquedaProducto = arrayBusquedaVenta;

  dataVenta: Venta[] = [];

  // Venta
  showVenta: boolean = false;

  ventaSelected: Venta = {
    id_venta: 0,
    talonario_proforma: '',
    nro_proforma: '',
    fec_venta: '',
    costo_total: 0,
    descuento: 0,
    costo_pagar: 0,
    user_venta: '',
    nro_factura: ''
  };

  ventaType: string = '';


  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiarBusqueda() {
    this.formBusqueda.controls.busqueda.setValue('');
    this.formBusqueda.controls.value.setValue('');

    this.formBusqueda.untouched;
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickBusqueda() {
    if (this.formBusqueda.valid) {
      if (this.isOnline) {
        this.isLoading = true;
        const attribute = String(this.formBusqueda.value.value);
        //this.getOne(cod_producto);
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    }
  }

  onClickLimpiar() {
    this.isLoading = true;
    this.limpiarBusqueda();
    //this.getList();
  }

  onClickAgregar() {
    this.showVenta = true;  
    this.ventaType = 'agregar';
  }

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

}
