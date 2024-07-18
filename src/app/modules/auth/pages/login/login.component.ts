import { formatDate } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { catchError, timeout } from 'rxjs';
import { of } from 'rxjs';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goForGot, goLogin, goShared } from 'src/app/common/router/auth.route';
import { goAdmin } from 'src/app/common/router/index.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { UsuarioService } from 'src/app/common/utils/app/usuario/usuario.service';
import { deleteLocalStorageData, getLocalDataLogged, setLocalDataLogged } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private usuarioService: UsuarioService,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService
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
    this.isOnline = this.networkStatusService.isOnline;
    this.networkStatusService.isOnline$.subscribe(status => {
      this.isOnline = status;
    });
  }

  /** ---------------------------------- Variables de Inicio ---------------------------------- **/
  // ================ INICIO ================ //
  // Data Local Storeage - Variable
  isOnline!: boolean;

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
  formLogin = new FormGroup({
    usuario: new FormControl('dillus-admin@gmail.com', [Validators.required, Validators.email]),
    password: new FormControl('Mudanzas*123', [Validators.required])
  });

  backgroundImageUrl: string = 'assets/bg.png'; // Ruta de tu imagen


  /** ---------------------------------------- Methods ---------------------------------------- **/
  saveLoggedData(data: Usuario) {
    if (data != null) {
      this.dataLocalStorage.usuario = data;
      this.dataLocalStorage.loggedDate = formatDate(Date.now(), 'dd/MM/y, h:mm a', 'es');
      setLocalDataLogged(this.dataLocalStorage);

      goAdmin(this.router);
    }

  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickLogin() {
    if (this.formLogin.valid && this.isOnline) {
      this.login();
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  login() {
    this.isLoading = true;
    const user = String(this.formLogin.controls.usuario.value);
    const pass = String(this.formLogin.controls.password.value);

    this.usuarioService.usuarioAuth(user, pass).pipe(
      timeout(10000), // tiempo máximo de espera en milisegundos
      catchError(error => {
        if (error.name === 'TimeoutError') {
          // Manejar el error de tiempo de espera
          this.customErrorToast('La conexión ha tardado demasiado.');
          this.isLoading = false;
        } else {
          // Manejar otros errores, como la falta de conexión
          this.customErrorToast('Error de conexión.');
          this.isLoading = false;
        }
        // Devolver un Observable vacío o algún valor predeterminado
        return of(null);
      })
    )
      .subscribe({
        next: result => {
          if (result) {
            result as ApiResult;

            if (result.boolean) {
              //goShared(this.router);
              this.saveLoggedData(result.data[0]);
            } else {
              this.customErrorToast(result.message);
              this.isLoading = false;
            }
          }
        }
      });
  }

  /** ---------------------------------- Onclick file import ---------------------------------- **/

  /** ---------------------------------------- Receiver --------------------------------------- **/

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
