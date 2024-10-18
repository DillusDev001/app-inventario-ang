import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { ClienteCuentaHistorial } from 'src/app/common/utils/app/cliente-module/cliente-cuenta-historial/cliente-cuenta-historial.interface';
import { ClienteCuentaHistorialService } from 'src/app/common/utils/app/cliente-module/cliente-cuenta-historial/cliente-cuenta-historial.service';
import { ClienteCuenta } from 'src/app/common/utils/app/cliente-module/cliente-cuenta/cliente-cuenta.interface';
import { ClienteCuentaService } from 'src/app/common/utils/app/cliente-module/cliente-cuenta/cliente-cuenta.service';
import { Cliente } from 'src/app/common/utils/app/cliente-module/cliente/cliente.interface';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayTipoCuentaHistorial, arrayTipoPago } from 'src/app/common/utils/local/arrays/banca.array';
import { ImageService } from 'src/app/common/utils/local/image.service';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { numberValidator } from 'src/app/common/utils/local/validators.local';
import { pdfTicketComprobante } from 'src/app/common/utils/pdf/cliente-cuenta/cliente-cuenta-historial.ticket';

@Component({
  selector: 'app-cuenta-cliente',
  templateUrl: './cuenta-cliente.component.html',
  styleUrls: ['./cuenta-cliente.component.css']
})
export class CuentaClienteComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private clienteCuentaService: ClienteCuentaService,
    private clienteCuentaHistorialService: ClienteCuentaHistorialService,
    private imgService: ImageService
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

    this.formMovimiento.controls.monto.setValidators(numberValidator());
    this.getClienteCuenta();
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
  formMovimiento = new FormGroup({
    tipo: new FormControl('', [Validators.required]),
    metodo_cuenta: new FormControl('', [Validators.required]),
    monto: new FormControl('', [Validators.required]),
  });

  @Input() cliente!: Cliente;

  @Output() response: EventEmitter<any> = new EventEmitter();

  clienteCuenta: ClienteCuenta = {
    id_cliente: 0,
    monto: 0,
    fec_mod: '',
    user_mod: ''
  }

  hasClienteCuenta: boolean = false;

  dataHistorial: ClienteCuentaHistorial[] = [];

  showAgregarHistorial: boolean = false;

  dataTipoCuentaHistorial = arrayTipoPago;
  dataMetodoHistorial = arrayTipoCuentaHistorial;

  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiarFormMovimento() {
    this.formMovimiento.reset();
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickCrearCuenta() {
    this.isLoading = true;
    this.crearCuenta();
  }

  onClickShowAgregarHistorial(sw: boolean) {
    this.showAgregarHistorial = sw;
  }

  onClickAgregarHistorial() {
    if (this.formMovimiento.valid) {
      this.isLoading = true;

      const data = {
        id_cliente: this.cliente.id_cliente,
        tipo: this.formMovimiento.controls.tipo.value,
        metodo_cuenta: this.formMovimiento.controls.metodo_cuenta.value,
        monto: Number(this.formMovimiento.controls.monto.value),
        user_mod: this.userLogeado.usuario
      }

      this.agregarClienteCuentaHistorial(data);
    } else {

    }
  }

  onClickCerrarHistorial() {
    this.response.emit(
      {
        bool: false,
        data: null
      }
    );
  }

  onClickPrintComprobante(index: number) {
    const imageUrl = 'assets/logo-black.png';
    this.imgService.getImageBase64(imageUrl).subscribe(base64 => {
      pdfTicketComprobante(this.cliente, this.clienteCuenta, this.dataHistorial[index], this.userLogeado, 'imprimir', base64);
    });
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  crearCuenta() {
    const data = {
      id_cliente: this.cliente.id_cliente,
      user_mod: this.userLogeado.usuario
    }

    this.clienteCuentaService.clienteCuentaAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message)
        this.hasClienteCuenta = true;
      } else {
        this.msgAlert = result.message;
      }
      this.isLoading = false;
    });
  }

  agregarClienteCuentaHistorial(data: any) {
    this.clienteCuentaHistorialService.clienteCuentaHistorialAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.showAgregarHistorial = false;
        // Modificar Cuenta Monto
        const dataCuenta = {
          monto: this.formMovimiento.controls.tipo.value === 'Abono' ?
            Number(this.formMovimiento.controls.monto.value) + Number(this.clienteCuenta.monto) :
            Number(this.clienteCuenta.monto) - Number(this.formMovimiento.controls.monto.value),
          user_mod: this.userLogeado.usuario
        }

        this.modificarClienteCuenta(dataCuenta);

      } else {
        this.msgAlert = result.message;
        this.isLoading = false;
      }
    });
  }

  modificarClienteCuenta(data: any) {
    this.clienteCuentaService.clienteCuentaActualizar(this.cliente.id_cliente, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiarFormMovimento();
        this.getClienteCuenta();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getClienteCuenta() {
    this.clienteCuentaService.clienteCuentaGetById(this.cliente.id_cliente).subscribe(result => {
      result as ApiResult;

      this.hasClienteCuenta = result.boolean;
      if (result.boolean) {
        this.clienteCuenta = result.data[0] as ClienteCuenta;
        this.getHistorialCuenta();
      } else {
        this.isLoading = false;
      }
    });
  }

  getHistorialCuenta() {
    this.clienteCuentaHistorialService.clienteCuentaHistorialGetById(this.cliente.id_cliente).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataHistorial = result.data as ClienteCuentaHistorial[];
      } else {
        this.dataHistorial = [];
      }
      this.isLoading = false;
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onDropdownValueChangeTipo(value: any) {
    if (value !== undefined) {
      if (value['value'] === 'retiro') {
        this.formMovimiento.controls.monto.setValidators(numberValidator(this.clienteCuenta.monto));
      } else {
        this.formMovimiento.controls.monto.setValidators(numberValidator());
      }
    } else {
      this.formMovimiento.controls.monto.setValidators(numberValidator());
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
