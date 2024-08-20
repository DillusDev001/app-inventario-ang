import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Color } from 'src/app/common/utils/app/mantenimiento/color/color.interface';
import { ColorService } from 'src/app/common/utils/app/mantenimiento/color/color.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-color',
  templateUrl: './color.component.html',
  styleUrls: ['./color.component.css']
})
export class ColorComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private colorService: ColorService
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

    this.getListaColor();
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
  formColor = new FormGroup({
    color: new FormControl('', [Validators.required])
  });

  data: Color[] = [];

  btnText: string = 'Agregar';

  itemSelected: Color = {
    id_color: 0,
    color: '',
    user_crea: '',
    fec_crea: ''
  }


  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiar() {
    this.btnText = 'Agregar';
    this.itemSelected = {
      id_color: 0,
      color: '',
      user_crea: '',
      fec_crea: ''
    }
    this.formColor.controls.color.setValue('');
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formColor.valid) {
      let data = {};

      switch (this.btnText) {
        case 'Agregar':
          data = {
            color: String(this.formColor.value.color),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.agregarColor(data);
          break;

        case 'Actualizar':
          data = {
            color: String(this.formColor.value.color),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.actualizarColor(this.itemSelected.id_color, data);
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
      this.formColor.controls.color.setValue(this.itemSelected.color);
      this.btnText = 'Actualizar';
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getListaColor() {
    this.colorService.colorGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.data = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  agregarColor(data: any) {
    this.colorService.colorAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaColor();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  actualizarColor(id_color: number, data: any) {
    this.colorService.colorUpdate(id_color, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaColor();
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
