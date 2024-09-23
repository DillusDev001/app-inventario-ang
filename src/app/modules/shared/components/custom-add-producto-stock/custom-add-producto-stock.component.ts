import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { StockGeneral } from 'src/app/common/utils/app/stock-module/stock-general/stock-general.interface';
import { StockGeneralService } from 'src/app/common/utils/app/stock-module/stock-general/stock-general.service';
import { StockSucursal } from 'src/app/common/utils/app/stock-module/stock-sucursal/stock-sucursal.interface';
import { StockSucursalService } from 'src/app/common/utils/app/stock-module/stock-sucursal/stock-sucursal.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { mathExpressionValidator } from 'src/app/common/utils/local/mathValidator.local';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { numberValidator } from 'src/app/common/utils/local/validators.local';

@Component({
  selector: 'app-custom-add-producto-stock',
  templateUrl: './custom-add-producto-stock.component.html',
  styleUrls: ['./custom-add-producto-stock.component.css']
})
export class CustomAddProductoStockComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private stockGeneralService: StockGeneralService,
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
  }

  /** ---------------------------------------- OnInit ----------------------------------------- **/
  ngOnInit(): void {
    //initFlowbite();
    this.isOnline = this.networkStatusService.isOnline;
    this.networkStatusService.isOnline$.subscribe(status => {
      this.isOnline = status;
    });

    switch (this.type) {
      case 'editar':
        this.title = 'Editar Producto';
        break;

      case 'ver':
        this.title = 'Producto';
        break;
    }

    if (this.productoType === 'sucursal') {
      this.formProducto.controls.cantidad.setValue(String(this.prodStockSucursal.cantidad));
      this.stockSucursalGetOneCantidad();
    } else {
      this.formProducto.controls.cantidad.setValidators(numberValidator());
      this.formProducto.controls.cantidad.setValue(String(this.prodStockGeneral.cantidad));
      this.isLoading = false;
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
  isLoading: boolean = true;

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  formProducto = new FormGroup({
    cantidad: new FormControl('', [Validators.required])
  });

  title: string = '';

  @Input() prodStockGeneral!: StockGeneral;
  @Input() prodStockSucursal!: StockSucursal;
  @Input() type!: string;
  @Input() productoType!: string;

  @Output() response: EventEmitter<any> = new EventEmitter();

  resultCantidad: any = {}

  /** ---------------------------------------- Methods ---------------------------------------- **/

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formProducto.valid) {
      const cantidadControl = this.formProducto.controls.cantidad;
      let value = null;
      let result = 0;

      switch (this.productoType) {
        case 'general':

          let dataGeneral = {
            cod_producto: this.prodStockGeneral.cod_producto,
            cantidad: Number(this.formProducto.controls.cantidad.value),
          };

          if (cantidadControl) {
            value = cantidadControl.value;

            if (typeof value === 'string') {
              result = eval(value);
              dataGeneral.cantidad = result;
            }
          }

          this.stockGeneralUpdate(dataGeneral);
          break;

        case 'sucursal':
          let dataSucursal = {
            cantidad: Number(this.formProducto.controls.cantidad.value),
          }

          if (cantidadControl) {
            value = cantidadControl.value;

            if (typeof value === 'string') {
              result = eval(value);
              dataSucursal.cantidad = result;
            }
          }
          this.stockSucursalUpdate(dataSucursal);
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

  onClickEditarProducto() {
    this.response.emit(
      {
        bool: false,
        data: 'editarProducto'
      }
    );
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  stockGeneralUpdate(data: any) {
    this.stockGeneralService.stockGeneralUpdate(this.prodStockGeneral.cod_producto, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.response.emit(
          {
            bool: true,
            data: null
          }
        );
      } else {
        this.customErrorToast(result.message);
      }
    });
  }

  stockSucursalGetOneCantidad() {
    this.stockSucursalService.stockSucursalGetOneCantidad(this.prodStockSucursal.cod_producto).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.resultCantidad = result.data[0];
        const max = this.prodStockSucursal.cantidad + this.resultCantidad['max'];
        this.formProducto.controls.cantidad.setValidators(numberValidator(max));
        //this.formProducto.controls.cantidad.setValidators([Validators.max(max)]);
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  stockSucursalUpdate(data: any) {
    this.stockSucursalService.stockSucursalUpdate(
      this.prodStockSucursal.id_sucursal, this.prodStockSucursal.id_almacen, this.prodStockSucursal.cod_producto, data
    ).subscribe(result => {
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
      }
    });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/

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
