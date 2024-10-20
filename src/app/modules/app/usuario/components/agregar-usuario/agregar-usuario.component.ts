import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { ResponseEmitter } from 'src/app/common/interfaces/emitter/response.emitter';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { UsuarioService } from 'src/app/common/utils/app/usuario/usuario.service';
import { arrayPreguntas, arraySexo } from 'src/app/common/utils/local/arrays/common.array';
import { getCode } from 'src/app/common/utils/local/code.local';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { letraCapital } from 'src/app/common/utils/local/utils.utils';

@Component({
  selector: 'app-agregar-usuario',
  templateUrl: './agregar-usuario.component.html',
  styleUrls: ['./agregar-usuario.component.css']
})
export class AgregarUsuarioComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
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
      case 'nuevo':
        this.isLoading = false;
        this.show = true;
        this.formUsuario.controls.password.addValidators(Validators.required);
        this.formUsuario.controls.pregunta.addValidators(Validators.required);
        this.formUsuario.controls.respuesta.addValidators(Validators.required);
        break;

      case 'editar':
        this.show = false;
        this.formUsuario.controls.usuario.disable();
        this.getUsuario();
        break;

      case 'ver':
        this.show = false;
        this.formUsuario.disable();
        this.getUsuario();
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
  formUsuario = new FormGroup({
    usuario: new FormControl('', [Validators.required, Validators.email]),
    nombres: new FormControl('', [Validators.required]),
    apellidos: new FormControl('', [Validators.required]),
    password: new FormControl(''),
    pregunta: new FormControl(''),
    respuesta: new FormControl(''),
    celular: new FormControl('', [Validators.required]),
    sexo: new FormControl('', [Validators.required]),
  });


  @Input() type: string = ''; // ver - editar
  @Input() title: string = '';
  @Input() usuario: string = '';
  @Input() rol!: string;
  @Input() autorizacion!: number;

  @Output() response: EventEmitter<ResponseEmitter> = new EventEmitter();

  user!: Usuario;

  show!: boolean;

  dataSexo = arraySexo;
  dataPregunta = arrayPreguntas;


  /** ---------------------------------------- Methods ---------------------------------------- **/
  setDataUI() {
    this.formUsuario.controls.usuario.setValue(this.user.usuario);
    this.formUsuario.controls.nombres.setValue(this.user.nombres);
    this.formUsuario.controls.apellidos.setValue(this.user.apellidos);
    this.formUsuario.controls.password.setValue(this.user.password);
    this.formUsuario.controls.pregunta.setValue(this.user.pregunta);
    this.formUsuario.controls.respuesta.setValue(this.user.respuesta);
    this.formUsuario.controls.celular.setValue(this.user.celular);
    this.formUsuario.controls.sexo.setValue(this.user.sexo);

    this.isLoading = false;
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formUsuario.valid) {
      if (this.isOnline) {
        this.isLoading = true;

        let data = {} as Usuario;

        switch (this.type) {
          case 'nuevo':
            data = {
              usuario: String(this.formUsuario.value.usuario).trim(),
              nombres: letraCapital(String(this.formUsuario.value.nombres).trim()),
              apellidos: letraCapital(String(this.formUsuario.value.apellidos).trim()),
              password: this.formUsuario.value.password,
              pregunta: this.formUsuario.value.pregunta,
              respuesta: this.formUsuario.value.respuesta,
              celular: String(this.formUsuario.value.celular).trim(),
              sexo: this.formUsuario.value.sexo,
              rol: this.rol,
              autorizacion: this.autorizacion
            } as Usuario

            this.agregarUsuario(data);
            break;

          case 'editar':
            data = {
              nombres: letraCapital(String(this.formUsuario.value.nombres).trim()),
              apellidos: letraCapital(String(this.formUsuario.value.apellidos).trim()),
              celular: String(this.formUsuario.value.celular).trim(),
              sexo: this.formUsuario.value.sexo,
            } as Usuario
            this.editarUsuario(data);
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
  getUsuario() {

    this.usuarioService.usuarioGet(this.usuario).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.user = result.data[0];
        this.setDataUI();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  agregarUsuario(data: any) {
    this.usuarioService.usuarioAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.response.emit(
          {
            bool: true,
            data: {
              usuario: data['usuario']
            }
          }
        );
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  editarUsuario(data: Usuario) {
    this.usuarioService.usuarioActualizar(this.usuario, data).subscribe(result => {
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
