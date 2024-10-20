import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Cliente } from 'src/app/common/utils/app/cliente-module/cliente/cliente.interface';
import { ClienteService } from 'src/app/common/utils/app/cliente-module/cliente/cliente.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayCiudad } from 'src/app/common/utils/local/arrays/common.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { letraCapital } from 'src/app/common/utils/local/utils.utils';

@Component({
  selector: 'app-agregar-cliente',
  templateUrl: './agregar-cliente.component.html',
  styleUrls: ['./agregar-cliente.component.css']
})
export class AgregarClienteComponent implements OnInit {
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
        this.title = 'Agregar Cliente';
        break;

      case 'editar':
        this.title = 'Editar Cliente';

        this.formCliente.controls.cliente.setValue(this.cliente.cliente);
        this.formCliente.controls.ci.setValue(this.cliente.ci);
        this.formCliente.controls.razon.setValue(this.cliente.razon);
        this.formCliente.controls.nit.setValue(this.cliente.nit);
        this.formCliente.controls.celular.setValue(this.cliente.celular);
        this.formCliente.controls.ciudad.setValue(this.cliente.ciudad);
        break;

      case 'ver':
        this.title = 'Cliente';

        this.formCliente.controls.cliente.setValue(this.cliente.cliente);
        this.formCliente.controls.ci.setValue(this.cliente.ci);
        this.formCliente.controls.razon.setValue(this.cliente.razon);
        this.formCliente.controls.nit.setValue(this.cliente.nit);
        this.formCliente.controls.celular.setValue(this.cliente.celular);
        this.formCliente.controls.ciudad.setValue(this.cliente.ciudad);

        this.formCliente.disable();
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

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  formCliente = new FormGroup({
    cliente: new FormControl('', [Validators.required]),
    ci: new FormControl('', [Validators.required]),
    razon: new FormControl('', [Validators.required]),
    nit: new FormControl('', [Validators.required]),
    celular: new FormControl('', [Validators.required]),
    ciudad: new FormControl('', [Validators.required]),
  });

  dataCiudad = arrayCiudad;

  title: string = '';

  @Input() cliente!: Cliente;
  @Input() type!: string;

  @Output() response: EventEmitter<any> = new EventEmitter();



  /** ---------------------------------------- Methods ---------------------------------------- **/

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formCliente.valid && this.isOnline) {
      let data = {};
      switch (this.type) {
        case 'agregar':
          this.isLoading = true;
          data = {
            cliente: letraCapital(String(this.formCliente.value.cliente).trim()),
            ci: String(this.formCliente.value.ci).trim(),
            razon: String(this.formCliente.value.razon).trim().toUpperCase(),
            nit: String(this.formCliente.value.nit).trim(),
            celular: String(this.formCliente.value.celular).trim(),
            ciudad: this.formCliente.value.ciudad,
          };

          this.clienteAgregar(data);
          break;

        case 'editar':
          this.isLoading = true;
          data = {
            cliente: letraCapital(String(this.formCliente.value.cliente).trim()),
            ci: String(this.formCliente.value.ci).trim(),
            razon: String(this.formCliente.value.razon).trim().toUpperCase(),
            nit: String(this.formCliente.value.nit).trim(),
            celular: String(this.formCliente.value.celular).trim(),
            ciudad: this.formCliente.value.ciudad,
          };

          this.clienteActualizar(data);
          break;
      }
    }
  }

  onClickCancelar() {
    this.response.emit(
      {
        bool: false,
        data: null
      }
    );
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  clienteAgregar(data: any) {
    this.clienteService.clienteAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.response.emit(
          {
            bool: true,
            data: null
          }
        );
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  clienteActualizar(data: any) {
    this.clienteService.clienteActualizar(this.cliente.id_cliente, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.response.emit(
          {
            bool: true,
            data: null
          }
        );
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/

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
