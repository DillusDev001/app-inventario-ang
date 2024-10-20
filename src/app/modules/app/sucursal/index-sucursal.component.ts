import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Almacen } from 'src/app/common/utils/app/almacen/almacen.interface';
import { AlmacenService } from 'src/app/common/utils/app/almacen/almacen.service';
import { Sucursal } from 'src/app/common/utils/app/sucursal/sucursal.interface';
import { SucursalService } from 'src/app/common/utils/app/sucursal/sucursal.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-index-sucursal',
  templateUrl: './index-sucursal.component.html',
  styleUrls: ['./index-sucursal.component.css']
})
export class IndexSucursalComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private sucursalService: SucursalService,
    private almacenService: AlmacenService
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

    this.getListaSucursal();
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
  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  dataSucursal: Sucursal[] = [];
  dataAlmacen: Almacen[] = [];

  id_sucursal: number = 0;
  id_almacen: number = 0;

  showAddSucursal: boolean = false;
  showAddAlmacen: boolean = false;

  sucursalAddType: string = '';
  almacenAddType: string = '';


  /** ---------------------------------------- Methods ---------------------------------------- **/
  getListaSucursal() {
    this.dataSucursal = [];
    this.sucursalService.sucursalGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataSucursal = result.data;
        if(this.id_sucursal !== 0){
          this.getListaAlmacen();
        } else {
          this.isLoading = false;
        }
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getListaAlmacen() {
    this.dataAlmacen = [];
    this.almacenService.almacenGetList(this.id_sucursal).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataAlmacen = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAgregarSucursal() {
    this.sucursalAddType = 'agregar';
    this.id_sucursal = 0;
    this.showAddSucursal = true;
  }

  onClickVerAlmacen(index: number) { }

  onClickActulizarAlmacen(index: number) {
    this.almacenAddType = 'editar';
    this.id_almacen = this.dataAlmacen[index].id_almacen;
    this.showAddAlmacen = true;
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  sucursalCardResponse(result: ResponseEmitter, index: number) {
    if (result.bool) {
      switch (result.data['type']) {

        case 'agregar': // Agregar Almacen
          this.almacenAddType = 'agregar';
          this.id_sucursal = result.data['id_sucursal'];
          this.showAddAlmacen = true;
          break;

        case 'editar': // Editar Sucursal
          this.sucursalAddType = 'editar';
          this.id_sucursal = result.data['id_sucursal'];
          this.showAddSucursal = true;
          break;

        case 'card': // Click Sucursal
          if (result.data['id_sucursal'] !== this.id_sucursal) {
            this.id_sucursal = result.data['id_sucursal'];
            this.isLoading = true;
            this.getListaAlmacen();
          }
          break;
      }
    }
  }

  sucursalAddResponse(result: ResponseEmitter) {
    if (result.bool) {
      this.showAddSucursal = false;
      this.isLoading = true;
      this.getListaSucursal();
    } else {
      this.customErrorToast('Cancelado Sucursal!!!');
      this.showAddSucursal = false;
    }
  }

  almacenAddResponse(result: ResponseEmitter) {
    if (result.bool) {
      this.showAddAlmacen = false;
      this.isLoading = true;
      this.getListaAlmacen();
    } else {
      this.customErrorToast('Cancelado Almacen!!!');
      this.showAddAlmacen = false;
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
