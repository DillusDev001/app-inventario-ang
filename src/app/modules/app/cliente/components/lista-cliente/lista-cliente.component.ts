import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Cliente } from 'src/app/common/utils/app/cliente/cliente.interface';
import { ClienteService } from 'src/app/common/utils/app/cliente/cliente.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayBusquedaCliente } from 'src/app/common/utils/local/arrays/busqueda.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-lista-cliente',
  templateUrl: './lista-cliente.component.html',
  styleUrls: ['./lista-cliente.component.css']
})
export class ListaClienteComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private clienteService: ClienteService
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

    this.clienteLista();
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
  isLoading: boolean = true;

  // Confirmacion
  showConfirmation: boolean = false;

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  formBusqueda = new FormGroup({
    busqueda: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  dataBusquedaCliente = arrayBusquedaCliente;

  dataClientes: Cliente[] = [];

  showAgregar: boolean = false;

  // CLIENTE
  showCliente: boolean = false;

  clienteSelected: Cliente = {
    id_cliente: 0,
    cliente: '',
    razon: '',
    nit: '',
    celular: ''
  }

  clienteType: string = '';



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
        const attribute = String(this.formBusqueda.value.busqueda);
        const value = String(this.formBusqueda.value.value);
        this.clienteBusqueda(attribute, value);
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    }
  }

  onClickLimpiar() {
    this.isLoading = true;
    this.limpiarBusqueda();
    this.clienteLista();
  }

  onClickAgregar() {
    this.showCliente = true;
    this.clienteType = 'agregar';
  }

  onClickItemTable(type: string, index: number) {
    this.clienteSelected = this.dataClientes[index];
    this.clienteType = type;

    this.showCliente = true;
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  clienteLista() {
    this.clienteService.clienteLista().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataClientes = result.data as Cliente[];
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  clienteBusqueda(attribute: string, value: string) {
    this.clienteService.clienteBusqueda(attribute, value).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataClientes = result.data as Cliente[];
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

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

  onReciveResponseAddCliente(event: ResponseEmitter) {
    if (event.bool) {
      this.showCliente = false;
      this.isLoading = true;
      this.clienteLista();
    } else {
      this.showCliente = false;
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