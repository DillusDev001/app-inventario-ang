import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Categoria } from 'src/app/common/utils/app/mantenimiento/categoria/categoria.interface';
import { CategoriaService } from 'src/app/common/utils/app/mantenimiento/categoria/categoria.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { letraCapital } from 'src/app/common/utils/local/utils.utils';

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.css']
})
export class CategoriaComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private categoriaService: CategoriaService
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

    this.getListaCategoria();
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
  formCategoria = new FormGroup({
    categoria: new FormControl('', [Validators.required])
  });

  data: Categoria[] = [];

  btnText: string = 'Agregar';

  itemSelected: Categoria = {
    id_categoria: 0,
    categoria: '',
    user_crea: '',
    fec_crea: ''
  }


  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiar() {
    this.btnText = 'Agregar';
    this.itemSelected = {
      id_categoria: 0,
      categoria: '',
      user_crea: '',
      fec_crea: ''
    }
    this.formCategoria.controls.categoria.setValue('');
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formCategoria.valid) {
      let data = {};

      switch (this.btnText) {
        case 'Agregar':
          data = {
            categoria: letraCapital(String(this.formCategoria.value.categoria).trim()),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.agregarCategoria(data);
          break;

        case 'Actualizar':
          data = {
            categoria: letraCapital(String(this.formCategoria.value.categoria).trim()),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.actualizarCategoria(this.itemSelected.id_categoria, data);
          break;
      }
    }
  }

  onClickCancelar() {
    this.limpiar();
  }

  onClickActulizar(index: number) {
    if (this.btnText === 'Agregar') {
      this.itemSelected = this.data[index];
      this.formCategoria.controls.categoria.setValue(this.itemSelected.categoria);
      this.btnText = 'Actualizar';
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getListaCategoria() {
    this.categoriaService.categoriaGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.data = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  agregarCategoria(data: any) {
    this.categoriaService.categoriaAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaCategoria();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  actualizarCategoria(id_categoria: number, data: any) {
    this.categoriaService.categoriaUpdate(id_categoria, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaCategoria();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
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
