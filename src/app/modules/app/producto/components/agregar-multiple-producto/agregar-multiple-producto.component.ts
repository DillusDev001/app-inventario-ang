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
import { inicialesCapital, letraCapitalInicial } from 'src/app/common/utils/local/utils.utils';
import { numberValidator } from 'src/app/common/utils/local/validators.local';

@Component({
  selector: 'app-agregar-multiple-producto',
  templateUrl: './agregar-multiple-producto.component.html',
  styleUrls: ['./agregar-multiple-producto.component.css']
})
export class AgregarMultipleProductoComponent implements OnInit {
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
    tipo: new FormControl('Prenda', [Validators.required]),
    categoria: new FormControl('', [Validators.required]),
    material: new FormControl('', [Validators.required]),
    sexo: new FormControl('Varón', [Validators.required]),
    descripcion: new FormControl('', []),
    precio_unitario: new FormControl('', [Validators.required, numberValidator()]),
    precio_mayor: new FormControl('', [Validators.required, numberValidator()]),
    color: new FormControl('', [Validators.required]),

    talla: new FormControl('', []),
  });

  formTalla = new FormGroup({
    talla: new FormControl('', [Validators.required]),
  })

  formDataTalla: any[] = [];

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


  hexaColor: string = '#';

  /** ---------------------------------------- Methods ---------------------------------------- **/
  generarCodigoProducto(): String {
    let codigo = '';

    codigo = String(this.formProducto.value.codigo).toUpperCase() + '-' +
      inicialesCapital(String(this.formProducto.value.tipo)) +
      this.getIDCategoria(String(this.formProducto.value.categoria)) +
      this.getIDTalla(String(this.formProducto.value.talla)) +
      this.getIDColor(String(this.formProducto.value.color)) +
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

  getObjTalla(talla: string): Talla | null {
    for (let i = 0; i < this.dataTalla.length; i++) {
      if (talla === this.dataTalla[i]['data']) {
        return this.dataTalla[i];
      }
    }
    return null;
  }

  containsTalla(talla: string): boolean {
    for (let i = 0; i < this.formDataTalla.length; i++) {
      if (talla === this.formDataTalla[i]['data']) {
        return true;
      }
    }
    return false;
  }

  getIDColor(color: string): number {
    for (let i = 0; i < this.dataColor.length; i++) {
      if (color === this.dataColor[i]['data']) {
        return this.dataColor[i]['id'];
      }
    }
    return 0;
  }

  getHexaColor(color: string): string {
    for (let i = 0; i < this.dataColor.length; i++) {
      if (color === this.dataColor[i]['data']) {
        return this.dataColor[i]['hexa'];
      }
    }
    return '';
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

        let dataSaveProducto: any[] = [];

        this.formDataTalla.forEach(element => {
          let data = {};
          const cod_producto = String(this.formProducto.value.codigo).toUpperCase() + '-' +
            inicialesCapital(String(this.formProducto.value.tipo)) +
            this.getIDCategoria(String(this.formProducto.value.categoria)) +
            this.getIDTalla(String(element.data)) +
            this.getIDColor(String(this.formProducto.value.color)) +
            this.getIDMaterial(String(this.formProducto.value.material));

          data = {
            cod_producto: cod_producto,
            cod_hash: '',
            codigo: String(this.formProducto.value.codigo).toUpperCase().trim().toUpperCase(),
            tipo: this.formProducto.value.tipo,
            categoria: this.formProducto.value.categoria,
            talla: element.data,
            color: this.formProducto.value.color,
            material: this.formProducto.value.material,
            sexo: this.formProducto.value.sexo,
            descripcion: letraCapitalInicial(String(this.formProducto.value.descripcion).trim()),
            precio_unitario: Number(String(this.formProducto.value.precio_unitario).trim()),
            precio_mayor: Number(String(this.formProducto.value.precio_mayor).trim()),
          }

          dataSaveProducto.push(data);



        });
        // Agregar Multiple Producto
        console.log(dataSaveProducto)
        this.agregarProductoMultiple(dataSaveProducto);
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

  onClickAgregarTalla() {
    if (this.formTalla.valid) {

      if (!this.containsTalla(String(this.formTalla.controls.talla.value))) {
        const talla = this.getObjTalla(String(this.formTalla.controls.talla.value));

        if (talla != null) {
          this.formDataTalla.push(talla);

          this.formTalla.reset();
          this.formTalla.controls.talla.setValue('');
        }
      } else {
        this.customErrorToast('La talla ya existe!!!')
      }
    }
  }

  onClickRemoveTalla(index: number){
    this.formDataTalla.splice(index, 1);
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
            hexa: item.hexadecimal,
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

        if (this.type !== 'agregar') {
          this.hexaColor = this.getHexaColor(this.producto.color);
          console.log('hexa: ', this.hexaColor)
        }
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

  agregarProductoMultiple(data: any[]) {
    this.productoService.productoAgregarMultiple(data).subscribe(result => {
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
  onDropdownValueChangeSucursal(value: any) {
    if (value !== undefined) {
      if (value['hexa'] !== '#') {
        this.hexaColor = value['hexa'];
      } else {
        this.hexaColor = '#FFFFFF';
      }
    } else {
      this.hexaColor = '#FFFFFF';
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
