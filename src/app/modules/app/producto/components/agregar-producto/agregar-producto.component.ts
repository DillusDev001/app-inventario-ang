import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Categoria } from 'src/app/common/utils/app/mantenimiento/categoria/categoria.interface';
import { CategoriaService } from 'src/app/common/utils/app/mantenimiento/categoria/categoria.service';
import { Color } from 'src/app/common/utils/app/mantenimiento/color/color.interface';
import { ColorService } from 'src/app/common/utils/app/mantenimiento/color/color.service';
import { Material } from 'src/app/common/utils/app/mantenimiento/material/material.interface';
import { MaterialService } from 'src/app/common/utils/app/mantenimiento/material/material.service';
import { Talla } from 'src/app/common/utils/app/mantenimiento/talla/talla.interface';
import { TallaService } from 'src/app/common/utils/app/mantenimiento/talla/talla.service';
import { Producto } from 'src/app/common/utils/app/producto/producto.interface';
import { ProductoService } from 'src/app/common/utils/app/producto/producto.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { arrayGeneroPrenda, arrayTipoPrenda } from 'src/app/common/utils/local/arrays/common.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { inicialesCapital } from 'src/app/common/utils/local/utils.utils';
import { numberValidator } from 'src/app/common/utils/local/validators.local';

@Component({
  selector: 'app-agregar-producto',
  templateUrl: './agregar-producto.component.html',
  styleUrls: ['./agregar-producto.component.css']
})
export class AgregarProductoComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private tallaService: TallaService,
    private colorService: ColorService,
    private materialService: MaterialService
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
        this.title = 'Agregar Producto';
        this.getCategoria();
        break;

      case 'editar':
        this.title = 'Editar Producto';
        this.formProducto.controls.codigo.disable();
        this.formProducto.controls.tipo.disable();
        this.formProducto.controls.categoria.disable();
        this.formProducto.controls.talla.disable();
        this.formProducto.controls.color.disable();
        this.formProducto.controls.material.disable();
        this.getProducto();
        break;

      case 'ver':
        this.title = 'Producto';
        this.formProducto.disable();
        this.getProducto();
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
  isLoading: boolean = true;

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  formProducto = new FormGroup({
    codigo: new FormControl('', [Validators.required]),
    tipo: new FormControl('', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    talla: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
    material: new FormControl('', [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', []),
    precio_unitario: new FormControl('', [Validators.required, numberValidator]),
    precio_mayor: new FormControl('', [Validators.required, numberValidator])
  });

  @Input() type: string = ''; // ver - editar
  @Input() cod_producto: string = '';

  @Output() response: EventEmitter<ResponseEmitter> = new EventEmitter();

  title: string = '';
  producto!: Producto;

  dataTipo = arrayTipoPrenda;

  dataCategoria: any[] = [];
  dataTalla: any[] = [];
  dataColor: any[] = [];
  dataMaterial: any[] = [];

  dataGeneroPrenda = arrayGeneroPrenda;

  /** ---------------------------------------- Methods ---------------------------------------- **/
  generarCodigoProducto(): String {
    let codigo = '';

    codigo = String(this.formProducto.value.codigo) + '-' +
      inicialesCapital(String(this.formProducto.value.tipo)) + '-' +
      this.getIDCategoria(String(this.formProducto.value.categoria)) + '-' +
      this.getIDTalla(String(this.formProducto.value.talla)) + '-' +
      this.getIDColor(String(this.formProducto.value.color)) + '-' +
      this.getIDMaterial(String(this.formProducto.value.material));

    return codigo;
  }

  getIDCategoria(categoria: string): number {
    for (let i = 0; i < this.dataCategoria.length; i++) {
      if (categoria === this.dataCategoria[i]['data']) {
        return this.dataCategoria[i]['id'];
      }
    }
    return 0;
  }

  getIDTalla(talla: string): number {
    for (let i = 0; i < this.dataTalla.length; i++) {
      if (talla === this.dataTalla[i]['data']) {
        return this.dataTalla[i]['id'];
      }
    }
    return 0;
  }

  getIDColor(color: string): number {
    for (let i = 0; i < this.dataColor.length; i++) {
      if (color === this.dataColor[i]['data']) {
        return this.dataColor[i]['id'];
      }
    }
    return 0;
  }

  getIDMaterial(material: string): number {
    for (let i = 0; i < this.dataMaterial.length; i++) {
      if (material === this.dataMaterial[i]['data']) {
        return this.dataMaterial[i]['id'];
      }
    }
    return 0;
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formProducto.valid) {
      if (this.isOnline) {
        this.isLoading = true;

        // generar codigo
        

        let data = {};

        switch (this.type) {
          case 'agregar':
            const cod_producto  = this.generarCodigoProducto();
            data = {
              cod_producto: cod_producto,
              cod_hash: '',
              codigo: this.formProducto.value.codigo,
              tipo: this.formProducto.value.tipo,
              categoria: this.formProducto.value.categoria,
              talla: this.formProducto.value.talla,
              color: this.formProducto.value.color,
              material: this.formProducto.value.material,
              sexo: this.formProducto.value.sexo,
              descripcion: this.formProducto.value.descripcion,
              precio_unitario: Number(this.formProducto.value.precio_unitario),
              precio_mayor: Number(this.formProducto.value.precio_mayor),
            }

            this.agregarProducto(data);
            break;

          case 'editar':
            data = {
              sexo: this.formProducto.value.sexo,
              descripcion: this.formProducto.value.descripcion,
              precio_unitario: Number(this.formProducto.value.precio_unitario),
              precio_mayor: Number(this.formProducto.value.precio_mayor),
            }
            this.editarProducto(data);
            break;
        }
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    } else {
      
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
  getProducto() {
    this.productoService.productoGetOne(this.cod_producto).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.producto = result.data[0] as Producto;
        this.formProducto.patchValue({
          codigo: this.producto.codigo,
          tipo: this.producto.tipo,
          categoria: this.producto.categoria,
          talla: this.producto.talla,
          color: this.producto.color,
          material: this.producto.material,
          sexo: this.producto.sexo,
          descripcion: this.producto.descripcion,
          precio_unitario: String(this.producto.precio_unitario),
          precio_mayor: String(this.producto.precio_mayor)
        });

        this.getCategoria();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getCategoria() {
    this.categoriaService.categoriaGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as Categoria[];

        dataResult.forEach(item => {
          this.dataCategoria.push({
            value: item.categoria,
            data: item.categoria,
            id: item.id_categoria
          })
        });

        this.getTalla();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getTalla() {
    this.tallaService.tallaGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as Talla[];

        dataResult.forEach(item => {
          this.dataTalla.push({
            value: item.talla,
            data: item.talla,
            id: item.id_talla
          })
        });

        this.getColor();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getColor() {
    this.colorService.colorGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as Color[];

        dataResult.forEach(item => {
          this.dataColor.push({
            value: item.color,
            data: item.color,
            id: item.id_color
          })
        });

        this.getMaterial();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getMaterial() {
    this.materialService.materialGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        const dataResult = result.data as Material[];

        dataResult.forEach(item => {
          this.dataMaterial.push({
            value: item.material,
            data: item.material,
            id: item.id_material
          })
        });
        this.isLoading = false;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  agregarProducto(data: any) {
    this.productoService.productoAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.response.emit(
          {
            bool: true,
            data: {
              type: 'agregar',
              data: result.data[0]
            }
          }
        );
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  editarProducto(data: any) {
    this.productoService.productoUpdate(this.cod_producto, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.response.emit(
          {
            bool: true,
            data: {
              type: 'editar',
              data: result.data[0]
            }
          }
        );
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
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
