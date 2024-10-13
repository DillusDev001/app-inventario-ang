import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NavigationStart, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { UsuarioService } from 'src/app/common/utils/app/usuario/usuario.service';
import { arrayBusquedaUsuario } from 'src/app/common/utils/local/arrays/busqueda.array';
import { arraySimpleMenu_0, arraySimpleMenu_1 } from 'src/app/common/utils/local/menu/menu-simple.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-lista-usuario',
  templateUrl: './lista-usuario.component.html',
  styleUrls: ['./lista-usuario.component.css']
})
export class ListaUsuarioComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private usuarioService: UsuarioService
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

    if (this.isOnline) {
      this.isLoading = true;
      this.getListaUsuarios();
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

  showUsuarioAlert: boolean = false;
  typeUsuarioAlert: string = '';
  titleUsuarioAlert: string = '';
  UsuarioAlert: string = '';

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  formBusqueda = new FormGroup({
    busqueda: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  dataBusquedaUsuario = arrayBusquedaUsuario

  dataUsuarios: Usuario[] = [];

  // Menu
  dataSimpleMenu_0 = arraySimpleMenu_0; // Eliminar
  dataSimpleMenu_1 = arraySimpleMenu_1; // Habilitar

  /** ---------------------------------------- Methods ---------------------------------------- **/

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickBusqueda() {
    if (this.formBusqueda.valid) {
      if (this.isOnline) {
        this.isLoading = true;
        const attribute = String(this.formBusqueda.value.busqueda);
        const value = String(this.formBusqueda.value.value);
        this.getBusquedaAttribute(attribute, value);
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    }
  }

  onClickLimpiar() {
    if (this.isOnline) {
      this.isLoading = true;
      this.formBusqueda.controls.busqueda.setValue('');
      this.formBusqueda.controls.value.setValue('');
      this.getListaUsuarios();
    } else {
      this.customErrorToast('No hay conexión a internet!!!')
    }
  }

  /*onClickVer(index: number) {
    if (this.isOnline) {
      this.typeUsuarioAlert = 'ver';
      this.titleUsuarioAlert = 'Usuario';
      this.UsuarioAlert = this.dataUsuarios[index].usuario;
      this.showUsuarioAlert = true;
    } else {
      this.customErrorToast('No hay conexión a internet!!!')
    }
  }*/

  /*onClickActulizar(index: number) {
    if (this.isOnline) {
      this.typeUsuarioAlert = 'editar';
      this.titleUsuarioAlert = 'Actualizar Usuario';
      this.UsuarioAlert = this.dataUsuarios[index].usuario;
      this.showUsuarioAlert = true;
    } else {
      this.customErrorToast('No hay conexión a internet!!!')
    }
  }*/

  onClickHabilitar(index: number) {
    this.isLoading = true;
    this.estadoUsuario(this.dataUsuarios[index].usuario, 1);
  }

  onClickEliminar(index: number) {
    this.isLoading = true;
    this.estadoUsuario(this.dataUsuarios[index].usuario, 0);
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getListaUsuarios() {
    this.dataUsuarios = [];

    this.usuarioService.usuarioLista().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataUsuarios = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  getBusquedaAttribute(attribute: string, value: string) {
    this.dataUsuarios = [];

    this.usuarioService.usuarioBusqueda(attribute, value).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataUsuarios = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  estadoUsuario(usuario: string, estado: number) {
    const data = {
      estado: estado
    }

    this.usuarioService.usuarioActualizar(usuario, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.msgAlert = estado === 1 ? 'Se ha habilitado correctamente.' : 'Se ha eliminado correctamente.';
        this.customSuccessToast(this.msgAlert);
        this.getListaUsuarios();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onReciveResponseUsuarioAlert(event: ResponseEmitter) {
    if (event.bool) {
      this.showUsuarioAlert = false;
      this.isLoading = true;
      if (this.formBusqueda.valid) {
        this.onClickBusqueda();
      } else {
        this.getListaUsuarios();
      }
    } else {
      this.showUsuarioAlert = false;
    }
  }

  onReciveResponseSimpleMenu(event: ResponseEmitter, index: number) {
    const action = event.data;
    this.typeUsuarioAlert = action;

    switch (action) {
      case 'ver':
        this.titleUsuarioAlert = 'Usuario';
        this.UsuarioAlert = this.dataUsuarios[index].usuario;
        this.showUsuarioAlert = true;
        break;

      case 'editar':
        this.titleUsuarioAlert = 'Editar Usuario';
        this.UsuarioAlert = this.dataUsuarios[index].usuario;
        this.showUsuarioAlert = true;
        break;

      case 'eliminar':
        if((this.userLogeado.rol === 'Developer' || this.userLogeado.rol === 'Administrador') && this.userLogeado.usuario !== this.dataUsuarios[index].usuario){
          this.isLoading = true;
          this.estadoUsuario(this.dataUsuarios[index].usuario, 0);
        } else {
          this.customErrorToast('La acción no puede completarse');
        }
        break;

      case 'habilitar':
        if((this.userLogeado.rol === 'Developer' || this.userLogeado.rol === 'Administrador') && this.userLogeado.usuario !== this.dataUsuarios[index].usuario){
          this.isLoading = true;
          this.estadoUsuario(this.dataUsuarios[index].usuario, 1);
        } else {
          this.customErrorToast('La acción no puede completarse');
        }
        break;

        /*<p *ngIf="item.estado === 0 && (userLogeado.rol === 'Developer' || userLogeado.rol === 'Administrador') && userLogeado.usuario !== item.usuario"
          class="underline underline-offset-1 cursor-pointer text-red-700"
          (click)="onClickHabilitar(i)">Habilitar</p>

        <p *ngIf="item.estado === 1 && (userLogeado.rol === 'Developer' || userLogeado.rol === 'Administrador') && userLogeado.usuario !== item.usuario"
          class="underline underline-offset-1 cursor-pointer text-info-700"
          (click)="onClickEliminar(i)">Eliminar</p>*/
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