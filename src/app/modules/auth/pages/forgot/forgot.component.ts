import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { UsuarioService } from 'src/app/common/utils/app/usuario/usuario.service';
import { arrayPreguntas } from 'src/app/common/utils/local/arrays/common.array';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrls: ['./forgot.component.css']
})
export class ForgotComponent {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
    private usuarioService: UsuarioService
  ) {

  }

  /** ---------------------------------------- OnInit ----------------------------------------- **/
  ngOnInit(): void {
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
  isLoading: boolean = false;

  // Info Alert
  alertInfo: boolean = false;

  // Confirmacion Alert
  alertConfirmacion: boolean = false;

  // Error Alert
  alertError: boolean = false;

  // Mensaje Alert
  msgAlert: string = '';

  result!: ApiResult;

  // ================  ================ //
  formForgot = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.email]),
    pregunta: new FormControl('', [Validators.required]),
    respuesta: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required])
  });

  backgroundImageUrl: string = 'assets/bg.png'; // Ruta de tu imagen

  dataPregunta = arrayPreguntas;


  /** ---------------------------------------- Methods ---------------------------------------- **/

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickForgot() {
    if (this.formForgot.valid) {
      if (this.isOnline) {
        this.isLoading = true;

        const data = {
          usuario: this.formForgot.value.usuario,
          pregunta: this.formForgot.value.pregunta,
          respuesta: this.formForgot.value.respuesta,
          password: this.formForgot.value.password
        } as Usuario

        this.usuarioActualizar(data.usuario, data);
      } else {
        this.customErrorToast('No hay conexión a internet!!!')
      }
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  usuarioActualizar(usuario: string, data: Usuario) {
    this.usuarioService.usuarioForgot(usuario, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message)
        goLogin(this.router);
      } else {
        this.customErrorToast(result.message)
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
