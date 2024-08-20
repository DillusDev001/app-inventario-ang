import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { UsuarioService } from 'src/app/common/utils/app/usuario/usuario.service';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-custom-add-almacen',
  templateUrl: './custom-add-almacen.component.html',
  styleUrls: ['./custom-add-almacen.component.css']
})
export class CustomAddAlmacenComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private almacenService: AlmacenService,
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

    switch (this.type) {
      case 'agregar':
        this.title = 'Agregar Almacen';
        this.getUsuarios();
        break;

      case 'editar':
        this.title = 'Editar Almacen';
        this.getAlmacen();
        break;

      case 'ver':
        this.title = 'Almacen';
        this.formAlmacen.disable();
        this.getAlmacen();
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
  formAlmacen = new FormGroup({
    nombre: new FormControl('', [Validators.required]),
    direccion: new FormControl('', [Validators.required]),
    telefono: new FormControl('', [Validators.required]),
    descripcion: new FormControl('', [Validators.required]),
    usuario_encargado: new FormControl('', [Validators.required]),
  });

  @Input() type: string = ''; // ver - editar
  @Input() id_sucursal: number = 0;
  @Input() id_almacen: number = 0;

  @Output() response: EventEmitter<ResponseEmitter> = new EventEmitter();

  title: string = '';
  almacen!: Almacen;

  dataUsuarios: any[] = [];


  /** ---------------------------------------- Methods ---------------------------------------- **/

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formAlmacen.valid) {
      if (this.isOnline) {
        this.isLoading = true;

        let data = {};

        switch (this.type) {
          case 'agregar':
            data = {
              id_sucursal: this.id_sucursal,
              nombre: this.formAlmacen.value.nombre,
              direccion: this.formAlmacen.value.direccion,
              telefono: this.formAlmacen.value.telefono,
              descripcion: this.formAlmacen.value.descripcion,
              usuario_encargado: this.formAlmacen.value.usuario_encargado
            }

            this.agregarAlmacen(data);
            break;

          case 'editar':
            data = {
              nombre: this.formAlmacen.value.nombre,
              direccion: this.formAlmacen.value.direccion,
              telefono: this.formAlmacen.value.telefono,
              descripcion: this.formAlmacen.value.descripcion,
              usuario_encargado: this.formAlmacen.value.usuario_encargado
            }
            this.editarAlmacen(data);
            break;
        }
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
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

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getAlmacen() {
    this.almacenService.almacenGetOne(this.id_almacen).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.almacen = result.data[0] as Almacen;
        this.formAlmacen.patchValue({
          nombre: this.almacen.nombre,
          direccion: this.almacen.direccion,
          telefono: this.almacen.telefono,
          descripcion: this.almacen.descripcion,
          usuario_encargado: this.almacen.usuario_encargado
        });
        this.getUsuarios();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  getUsuarios() {
    this.usuarioService.usuarioLista().subscribe(result => {
      result as ApiResult;
      if (result.boolean) {
        const dataResult = result.data as Usuario[];
        dataResult.forEach(item => {
          this.dataUsuarios.push({
            value: item.usuario,
            data: item.nombres + ' ' + item.apellidos
          })
        });
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  agregarAlmacen(data: any) {
    this.almacenService.almacenAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.response.emit(
          {
            bool: true,
            data: {
              type: 'agregar',
              data: result
            }
          }
        );
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  editarAlmacen(data: any) {
    this.almacenService.almacenUpdate(this.id_almacen, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.response.emit(
          {
            bool: true,
            data: {
              type: 'editar',
              data: result
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
