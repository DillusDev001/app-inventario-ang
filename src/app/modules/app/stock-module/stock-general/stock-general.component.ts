import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { ProductoService } from 'src/app/common/utils/app/producto/producto.service';
import { StockGeneral } from 'src/app/common/utils/app/stock-module/stock-general/stock-general.interface';
import { StockGeneralService } from 'src/app/common/utils/app/stock-module/stock-general/stock-general.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayBusquedaStockGeneral } from 'src/app/common/utils/local/arrays/busqueda.array';
import { arraySimpleMenu_1, arraySimpleMenu_0 } from 'src/app/common/utils/local/menu/menu-simple.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-stock-general',
  templateUrl: './stock-general.component.html',
  styleUrls: ['./stock-general.component.css']
})
export class StockGeneralComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private stockGeneralService: StockGeneralService,
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

    this.getList();
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
    busqueda: new FormControl('cod_producto', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  dataBusquedaProducto = arrayBusquedaStockGeneral;

  dataProductos: StockGeneral[] = [];

  showConfirmation = false;

  // PRODUCTO STOCKGENERAL
  showProdStockGeneral: boolean = false;

  prodStockGeneralSelected: StockGeneral = {
    cod_producto: '',
    cantidad: 0,
    fec_mod: '',
    producto: {
      cod_producto: '',
      cod_hash: '',
      codigo: '',
      tipo: '',
      categoria: '',
      talla: '',
      color: '',
      material: '',
      sexo: '',
      descripcion: '',
      precio_unitario: 0,
      precio_mayor: 0,
      estado: 0
    }

  }

  prodStockGeneralIndex: number = 0;

  productoCodeSelected: string = '';

  prodStockGeneralType: string = '';

  // PRODUCTO
  showProducto: boolean = false;

  // Menu
  dataSimpleMenu_0 = arraySimpleMenu_0; // Eliminar
  dataSimpleMenu_1 = arraySimpleMenu_1; // Habilitar

  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiarBusqueda() {
    this.formBusqueda.controls.busqueda.setValue('cod_producto');
    this.formBusqueda.controls.value.setValue('');

    this.formBusqueda.untouched;
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickBusqueda() {
    if (this.formBusqueda.valid) {
      if (this.isOnline) {
        this.isLoading = true;
        const attribute = String(this.formBusqueda.controls.busqueda.value);
        const value = String(this.formBusqueda.controls.value.value);
        this.getBusquedaAttribute(attribute, value);
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    }
  }

  onClickLimpiar() {
    this.isLoading = true;
    this.limpiarBusqueda();
    this.getList();
  }

  onClickAgregarFaltantes() {
    this.showConfirmation = true;
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getList() {
    this.stockGeneralService.stockGeneralGetList().subscribe(result => {
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

    this.stockGeneralService.stockGeneralFindAtribute(attribute, value).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.dataProductos = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  stockGeneralAgregarMultiple() {
    this.stockGeneralService.stockGeneralAgregarMultiple().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.getList();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
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
          this.getList();
        }

      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }


  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onReciveResponseConfirmation(event: ResponseEmitter) {
    if (event.bool) {
      this.showConfirmation = false;
      this.isLoading = true;
      this.stockGeneralAgregarMultiple();
    } else {
      this.customErrorToast('Cancelado!!!');
      this.showConfirmation = false;
    }
  }

  onReciveResponseProdStockGeneral(event: ResponseEmitter) {
    if (event.bool) {
      this.showProdStockGeneral = false;
      this.isLoading = true;
      this.limpiarBusqueda();
      this.getList();
    } else {
      if (event.data === 'editarProducto') {
        this.showProdStockGeneral = false;
        this.showProducto = true;
      } else {
        this.showProdStockGeneral = false;
      }
    }
  }

  onReciveResponseAddProducto(event: ResponseEmitter) {
    if (event.bool) {
      this.showProducto = false;
      this.limpiarBusqueda();
      this.isLoading = true;
      this.getList()
    } else {
      this.showProducto = false;
    }
  }

  onReciveResponseSimpleMenu(event: ResponseEmitter, index: number) {
    const action = event.data;

    switch (action) {
      case 'ver':
      case 'editar':
        this.prodStockGeneralIndex = index;
        this.prodStockGeneralSelected = this.dataProductos[index];
        this.productoCodeSelected = this.prodStockGeneralSelected.cod_producto
        this.prodStockGeneralType = action;
        this.showProdStockGeneral = true;
        break;

      case 'eliminar':
        this.isLoading = true;
        this.estadoProducto(this.dataProductos[index].producto.cod_producto, 0);
        break;

      case 'habilitar':
        this.isLoading = true;
        this.estadoProducto(this.dataProductos[index].producto.cod_producto, 1);
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
