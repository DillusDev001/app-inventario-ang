import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Cliente } from 'src/app/common/utils/app/cliente-module/cliente/cliente.interface';
import { ClienteService } from 'src/app/common/utils/app/cliente-module/cliente/cliente.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayBusquedaCliente } from 'src/app/common/utils/local/arrays/busqueda.array';
import { arraySimpleCuentaMenu_0, arraySimpleCuentaMenu_1 } from 'src/app/common/utils/local/menu/menu-simple-cuenta.array';
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
    ci: '',
    razon: '',
    nit: '',
    celular: '',
    ciudad: '',
    estado: 0
  }

  clienteType: string = '';

  // Menu
  dataSimpleMenu_0 = arraySimpleCuentaMenu_0; // Eliminar
  dataSimpleMenu_1 = arraySimpleCuentaMenu_1; // Habilitar

  // Cuenta
  showCuenta: boolean = false;

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

  /*onClickItemTable(type: string, index: number) {
    this.clienteSelected = this.dataClientes[index];
    this.clienteType = type;

    this.showCliente = true;
  }*/

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

  estadoCliente(id_cliente: number, estado: number) {
    const data = {
      estado: estado
    }

    this.clienteService.clienteActualizar(id_cliente, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.msgAlert = estado === 1 ? 'Se ha habilitado correctamente.' : 'Se ha eliminado correctamente.';
        this.customSuccessToast(this.msgAlert);

        if (this.formBusqueda.controls.value.value !== '') {
          this.onClickBusqueda();
        } else {
          this.clienteLista();
        }

      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onReciveResponseClienteCuenta(event: ResponseEmitter) {
    if (event.bool) {
      
    } else {
      this.showCuenta = false;
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

  onReciveResponseSimpleMenu(event: ResponseEmitter, index: number) {
    const action = event.data;

    console.log(action)

    switch (action) {
      case 'ver':
      case 'editar':
        this.clienteSelected = this.dataClientes[index];
        this.clienteType = action;

        this.showCliente = true;
        break;

      case 'eliminar':
        this.isLoading = true;
        this.estadoCliente(this.dataClientes[index].id_cliente, 0);
        break;

      case 'habilitar':
        this.isLoading = true;
        this.estadoCliente(this.dataClientes[index].id_cliente, 1);
        break;

      case 'cuenta':
        this.clienteSelected = this.dataClientes[index];
        this.showCuenta = true;
        break;
    }
  }

  /** --------------------------------------- ShowAlerts -------------------------------------- **/
  customSuccessToast(msg: string) {
    this.toast.success(msg, {
      duration: 2000,
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
