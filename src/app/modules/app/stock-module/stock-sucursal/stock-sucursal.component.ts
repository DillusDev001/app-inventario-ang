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
import { StockSucursal } from 'src/app/common/utils/app/stock-module/stock-sucursal/stock-sucursal.interface';
import { StockSucursalService } from 'src/app/common/utils/app/stock-module/stock-sucursal/stock-sucursal.service';
import { Sucursal } from 'src/app/common/utils/app/sucursal/sucursal.interface';
import { SucursalService } from 'src/app/common/utils/app/sucursal/sucursal.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayBanco } from 'src/app/common/utils/local/arrays/banca.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-stock-sucursal',
  templateUrl: './stock-sucursal.component.html',
  styleUrls: ['./stock-sucursal.component.css']
})
export class StockSucursalComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private sucursalService: SucursalService,
    private almacenService: AlmacenService,
    private stockSucursalService: StockSucursalService
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

    this.sucursalGetList();
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
  formSucursalSelected = new FormGroup({
    sucursal: new FormControl('', [Validators.required]),
    almacen: new FormControl('', [Validators.required])
  });

  formBusqueda = new FormGroup({
    busqueda: new FormControl('', [Validators.required]),
    value: new FormControl('', [Validators.required])
  });

  dataSucursal: any[] = [];
  dataAlmacen: any[] = [];

  dataProductos: StockSucursal[] = [];

  idSucursalSelected: number = 0;
  idAlmacenSelected: number = 0;

  showConfirmation = false;

  // PRODUCTO STOCKGENERAL
  showProdStockSucursal: boolean = false;

  prodStockSucursalSelected: StockSucursal = {
    cod_producto: '',
    id_sucursal: 0,
    id_almacen: 0,
    cantidad: 0,
    fec_mod: '',
    sucursal: {
      id_sucursal: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      usuario_encargado: '',
      descripcion: '',
      estado: 0,
      encargado: {
        usuario: '',
        nombres: '',
        apellidos: '',
        password: '',
        pregunta: '',
        respuesta: '',
        celular: '',
        sexo: '',
        rol: '',
        autorizacion: 0,
        estado: 0
      }
    },
    almacen: {
      id_almacen: 0,
      id_sucursal: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      descripcion: '',
      usuario_encargado: '',
      estado: 0,
      encargado: {
        usuario: '',
        nombres: '',
        apellidos: '',
        password: '',
        pregunta: '',
        respuesta: '',
        celular: '',
        sexo: '',
        rol: '',
        autorizacion: 0,
        estado: 0
      }
    },
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

  prodStockSucursalIndex: number = 0;

  productoCodeSelected: string = '';

  prodStockSucursalType: string = '';

  // PRODUCTO
  showProducto: boolean = false;


  /** ---------------------------------------- Methods ---------------------------------------- **/

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickItemTable(type: string, index: number) {
    this.prodStockSucursalIndex = index;
  
    this.prodStockSucursalSelected = this.dataProductos[index];
  
    this.productoCodeSelected = this.prodStockSucursalSelected.cod_producto
  
    this.prodStockSucursalType = type;
  
    this.showProdStockSucursal = true;
  }

  onClickAgregarFaltantes() {
    this.showConfirmation = true;
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  sucursalGetList() {
    this.sucursalService.sucursalGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as Sucursal[];

        dataResult.forEach(item => {
          this.dataSucursal.push({
            value: String(item.id_sucursal),
            data: item.nombre,
            id: item.id_sucursal
          })
        });

      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  almacenGetList(id_sucursal: number) {
    this.almacenService.almacenGetList(id_sucursal).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as Almacen[];

        dataResult.forEach(item => {
          this.dataAlmacen.push({
            value: String(item.id_almacen),
            data: item.nombre,
            id: item.id_almacen
          })
        });

      } else {
        this.dataAlmacen = [];
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  stockSucursalAlmacenGetList() {
    this.stockSucursalService.stockSucursalAlmacenGetList(this.idSucursalSelected, this.idAlmacenSelected).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as StockSucursal[];

        this.dataProductos = dataResult;

      } else {
        this.dataProductos = [];
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  stockSucursalAgregarMultiple() {
    this.stockSucursalService.stockSucursalAgregarMultiple(this.idSucursalSelected, this.idAlmacenSelected).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.stockSucursalAlmacenGetList();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/
  onDropdownValueChangeSucursal(value: any) {
    if (value !== undefined) {
      this.idSucursalSelected = value['id'];

      this.dataAlmacen = [];
      this.idAlmacenSelected = 0;
      this.formSucursalSelected.controls.almacen.setValue('');
      this.dataProductos = [];

      this.isLoading = true;
      this.almacenGetList(value['id']);
    } else {
      this.dataAlmacen = [];
      this.idSucursalSelected = 0;
      this.idAlmacenSelected = 0;
      this.dataProductos = [];
    }
  }

  onDropdownValueChangeAlmacen(value: any) {
    if (value !== undefined) {
      this.idAlmacenSelected = value['id'];

      this.isLoading = true;
      this.stockSucursalAlmacenGetList();
    } else {
      this.dataProductos = [];
    }
  }

  // ----------------------------------------------------------------
  onReciveResponseConfirmation(event: ResponseEmitter) {
    if (event.bool) {
      this.showConfirmation = false;
      this.isLoading = true;
      this.stockSucursalAgregarMultiple();
    } else {
      this.customErrorToast('Cancelado!!!');
      this.showConfirmation = false;
    }
  }

  onReciveResponseProdStockGeneral(event: ResponseEmitter) {
    if (event.bool) {
      this.showProdStockSucursal = false;
      this.isLoading = true;
      //this.limpiarBusqueda();
      this.stockSucursalAlmacenGetList();
    } else {
      if (event.data === 'editarProducto') {
        this.showProdStockSucursal = false;
        this.showProducto = true;
      } else {
        this.showProdStockSucursal = false;
      }
    }
  }

  onReciveResponseAddProducto(event: ResponseEmitter) {
    if (event.bool) {
      this.showProducto = false;
      //this.limpiarBusqueda();
      this.isLoading = true;
      this.stockSucursalAlmacenGetList();
    } else {
      this.showProducto = false;
    }
  }

  /** --------------------------------------- ShowAlerts -------------------------------------- **/
  customSuccessToast(msg: string) {
    this.toast.success(msg, {
      duration: 2000,
      position: 'top-right',
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
      position: 'top-right',
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
