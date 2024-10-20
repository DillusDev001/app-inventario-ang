import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { ApiResult } from 'src/app/common/interfaces/api/api.result';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin } from 'src/app/common/router/auth.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Material } from 'src/app/common/utils/app/mantenimiento/material/material.interface';
import { MaterialService } from 'src/app/common/utils/app/mantenimiento/material/material.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { deleteLocalStorageData, getLocalDataLogged } from 'src/app/common/utils/local/storage.local';
import { letraCapital } from 'src/app/common/utils/local/utils.utils';

@Component({
  selector: 'app-material',
  templateUrl: './material.component.html',
  styleUrls: ['./material.component.css']
})
export class MaterialComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
    private toast: HotToastService,
    private networkStatusService: NetworkStatusService,
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

    this.getListaMaterial();
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
  formMaterial = new FormGroup({
    material: new FormControl('', [Validators.required])
  });

  data: Material[] = [];

  btnText: string = 'Agregar';

  itemSelected: Material = {
    id_material: 0,
    material: '',
    user_crea: '',
    fec_crea: ''
  }


  /** ---------------------------------------- Methods ---------------------------------------- **/
  limpiar() {
    this.btnText = 'Agregar';
    this.itemSelected = {
      id_material: 0,
      material: '',
      user_crea: '',
      fec_crea: ''
    }
    this.formMaterial.controls.material.setValue('');
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickAceptar() {
    if (this.formMaterial.valid) {
      let data = {};

      switch (this.btnText) {
        case 'Agregar':
          data = {
            material: letraCapital(String(this.formMaterial.value.material).trim()),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.agregarMaterial(data);
          break;

        case 'Actualizar':
          data = {
            material: letraCapital(String(this.formMaterial.value.material).trim()),
            user_crea: this.userLogeado.usuario
          }

          this.isLoading = true;
          this.actualizarMaterial(this.itemSelected.id_material, data);
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
      this.formMaterial.controls.material.setValue(this.itemSelected.material);
      this.btnText = 'Actualizar';
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/
  getListaMaterial() {
    this.materialService.materialGetList().subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.data = result.data;
      } else {
        this.customErrorToast(result.message);
      }
      this.isLoading = false;
    });
  }

  agregarMaterial(data: any) {
    this.materialService.materialAgregar(data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaMaterial();
      } else {
        this.customErrorToast(result.message);
        this.isLoading = false;
      }
    });
  }

  actualizarMaterial(id_material: number, data: any) {
    this.materialService.materialUpdate(id_material, data).subscribe(result => {
      result as ApiResult;

      if (result.boolean) {
        this.customSuccessToast(result.message);
        this.limpiar();
        this.getListaMaterial();
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
