import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Producto } from 'src/app/common/utils/app/producto/producto.interface';
import { ProductoService } from 'src/app/common/utils/app/producto/producto.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayBusquedaProducto } from 'src/app/common/utils/local/arrays/busqueda.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-lista-producto',
  templateUrl: './lista-producto.component.html',
  styleUrls: ['./lista-producto.component.css']
})
export class ListaProductoComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private productoService: ProductoService
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
      this.getListaProductos();
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
  formBusqueda = new FormGroup({
    busqueda: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  dataBusquedaProducto = arrayBusquedaProducto; // Cambiar a Producto

  dataProductos: Producto[] = [];

  cod_prod_selected: string = '';

  productoAddType: string = '';

  showAddProducto = false;

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
        this.getBusquedaAttribute(attribute, value);
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    }
  }

  onClickAgregar() {
    this.productoAddType = 'agregar';
    this.showAddProducto = true;
  }

  onClickLimpiar() {
    this.isLoading = true;
    this.limpiarBusqueda();
    this.getListaProductos();
  }

  onClickActulizar(index: number) {
    this.cod_prod_selected = this.dataProductos[index].cod_producto;
    this.productoAddType = 'editar';
    this.showAddProducto = true;
  }

  onClickEliminar(index: number) {
    this.isLoading = true;

    this.eliminarProducto(this.dataProductos[index].cod_producto, 0);
  }

  onClickHabilitar(index: number) {
    this.isLoading = true;

    this.eliminarProducto(this.dataProductos[index].cod_producto, 1);
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getListaProductos() {
    this.dataProductos = [];

    this.productoService.productoGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataProductos = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  getBusquedaAttribute(attribute: string, value: string) {
    this.dataProductos = [];

    this.productoService.productoBusqueda(attribute, value).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataProductos = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  eliminarProducto(cod_producto: string, estado: number) {
    const data = {
      estado: estado
    }

    this.productoService.productoUpdate(cod_producto, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.msgAlert = estado === 1 ? 'Se ha habilitado correctamente.' : 'Se ha eliminado correctamente.';
        this.customSuccessToast(this.msgAlert);
        this.getListaProductos();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onReciveResponseAddProducto(event: ResponseEmitter) {
    if (event.bool) {
      this.showAddProducto = false;
      this.isLoading = true;
      this.getListaProductos();
    } else {
      this.showAddProducto = false;
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
      position: 'bottom-right',
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