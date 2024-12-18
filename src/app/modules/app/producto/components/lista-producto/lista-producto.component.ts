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
import { ImageService } from 'src/app/common/utils/local/image.service';
import { arraySimpleMenu_0, arraySimpleMenu_1 } from 'src/app/common/utils/local/menu/menu-simple.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { pdfProductoCBarCode } from 'src/app/common/utils/pdf/producto/bar-code.pdf';

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
    private productoService: ProductoService,
    private imageService: ImageService
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

  showProducto = false;

  showAddMultipleProducto = false;

  // Menu
  dataSimpleMenu_0 = arraySimpleMenu_0; // Eliminar
  dataSimpleMenu_1 = arraySimpleMenu_1; // Habilitar

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
    this.showAddMultipleProducto = true;
  }

  onClickLimpiar() {
    this.isLoading = true;
    this.limpiarBusqueda();
    this.getListaProductos();
  }

  onClickCodeBar(index: number){
    const barcode = this.imageService.generateBarcode(this.dataProductos[index].cod_producto);

    pdfProductoCBarCode(this.dataProductos[index], 'imprimir', barcode);
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

  estadoProducto(cod_producto: string, estado: number) {
    const data = {
      estado: estado
    }

    this.productoService.productoUpdate(cod_producto, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.msgAlert = estado === 1 ? 'Se ha habilitado correctamente.' : 'Se ha eliminado correctamente.';
        this.customSuccessToast(this.msgAlert);

        if (this.formBusqueda.controls.value.value !== '') {
          this.onClickBusqueda();
        } else {
          this.getListaProductos();
        }
        
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onReciveResponseProducto(event: ResponseEmitter) {
    if (event.bool) {
      this.showProducto = false;
      this.isLoading = true;
      this.getListaProductos();
    } else {
      this.showProducto = false;
    }
  }

  onReciveResponseAddMultipleProducto(event: ResponseEmitter) {
    if (event.bool) {
      this.showAddMultipleProducto = false;
      this.isLoading = true;
      this.getListaProductos();
    } else {
      this.showAddMultipleProducto = false;
    }
  }

  onReciveResponseSimpleMenu(event: ResponseEmitter, index: number) {
    const action = event.data;

    switch (action) {
      case 'ver':
      case 'editar':
        this.cod_prod_selected = this.dataProductos[index].cod_producto;
        this.productoAddType = action;
        this.showProducto = true;
        break;

      case 'eliminar':
        this.isLoading = true;
        this.estadoProducto(this.dataProductos[index].cod_producto, 0);
        break;

      case 'habilitar':
        this.isLoading = true;
        this.estadoProducto(this.dataProductos[index].cod_producto, 1);
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