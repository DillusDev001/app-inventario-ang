import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Talla } from 'src/app/common/utils/app/mantenimiento/talla/talla.interface';
import { TallaService } from 'src/app/common/utils/app/mantenimiento/talla/talla.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-talla',
  templateUrl: './talla.component.html',
  styleUrls: ['./talla.component.css']
})
export class TallaComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private tallaService: TallaService
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

    this.getListaTalla();
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
  formTalla = new FormGroup({
    talla: new FormControl('', [Validators.required])
  });

  data: Talla[] = [];

  btnText: string = 'Agregar';

  itemSelected: Talla = {
    id_talla: 0,
    talla: '',
    user_crea: '',
    fec_crea: ''
  }


  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiar() {
    this.btnText = 'Agregar';
    this.itemSelected = {
      id_talla: 0,
      talla: '',
      user_crea: '',
      fec_crea: ''
    }
    this.formTalla.controls.talla.setValue('');
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formTalla.valid) {
      let data = {};

      switch (this.btnText) {
        case 'Agregar':
          data = {
            talla: String(this.formTalla.value.talla).trim().toUpperCase(),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.agregarTalla(data);
          break;

        case 'Actualizar':
          data = {
            talla: String(this.formTalla.value.talla).trim().toUpperCase(),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.actualizarTalla(this.itemSelected.id_talla, data);
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
      this.formTalla.controls.talla.setValue(this.itemSelected.talla);
      this.btnText = 'Actualizar';
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getListaTalla() {
    this.tallaService.tallaGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.data = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  agregarTalla(data: any) {
    this.tallaService.tallaAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaTalla();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  actualizarTalla(id_talla: number, data: any) {
    this.tallaService.tallaUpdate(id_talla, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaTalla();
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
