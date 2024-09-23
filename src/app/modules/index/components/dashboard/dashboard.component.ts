import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { DataLocalStorage } from 'src/app/common/interfaces/local/data-local-storage';
import { goLogin, goShared } from 'src/app/common/router/auth.route';
import { goInicio } from 'src/app/common/router/index.route';
import { NetworkStatusService } from 'src/app/common/services/network-status.service';
import { Usuario } from 'src/app/common/utils/app/usuario/usuario.interface';
import { deleteLocalStorageData, getLocalDataLogged, localStorageLogOut } from 'src/app/common/utils/local/storage.local';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  /** -------------------------------------- Constructor -------------------------------------- **/
  constructor(
    private router: Router,
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

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.activeUrl = this.router.url;
        this.updateSelectedMenuItemFromUrl();
      }
    });


  }

  /** ---------------------------------------- OnInit ----------------------------------------- **/
  ngOnInit(): void {
    //initFlowbite();
    this.isOnline = this.networkStatusService.isOnline;
    this.networkStatusService.isOnline$.subscribe(status => {
      this.isOnline = status;
    });


    //this.updateSelectedMenuItemFromUrl();
  }

  /** ---------------------------------- Variables de Inicio ---------------------------------- **/
  // ================ INICIO ================ //
  // Para la url de navegacion
  activeUrl!: string;

  // Para ver si está en línea o no
  isOnline!: boolean;

  // Data Local Storeage - Variable
  dataLocalStorage: DataLocalStorage = {
    usuario: null,
    loggedDate: ''
  }

  // Usuario logeado
  userLogeado!: Usuario

  // loading spinner
  isLoading: boolean = true;

  // Mensaje Alert
  msgAlert: string = '';

  // ================  ================ //
  backgroundImageUrl: string = 'assets/nav-bg.png'; // Ruta de tu imagen

  // SideBar
  open: boolean = false;

  menuSelected: string = 'Inicio';

  title: string = this.menuSelected;

  booleanServicios: boolean = false;
  booleanMantenimieto: boolean = false;



  /** ---------------------------------------- Methods ---------------------------------------- **/
  updateSelectedMenuItemFromUrl() {
    const currentUrl = this.router.url;

    switch (currentUrl) {

      case '/admin/inicio':
        this.menuSelected = 'Inicio';
        this.title = 'Inicio';
        break;

      case '/admin/producto':
      case '/admin/producto':
        this.menuSelected = 'Artículos';
        this.title = 'Artículos';
        break;

      case '/admin/stock':
      case '/admin/stock/general':
      case '/admin/stock/sucursal':
        this.menuSelected = 'Stock';
        this.title = 'Stock';
        break;

      case '/admin/sucursal':
        this.menuSelected = 'Sucursal';
        this.title = 'Sucursal';
        break;

      case '/admin/cliente':
        this.menuSelected = 'Clientes';
        this.title = 'Clientes';
        break;

      // Compras

      case '/admin/venta':
        this.menuSelected = 'Ventas';
        this.title = 'Ventas';
        break;

      case '/admin/usuario':
        this.menuSelected = 'Usuarios';
        this.title = 'Usuarios';
        break;

      case '/admin/mantenimiento':
        this.menuSelected = 'Mantenimiento';
        this.title = 'Mantenimiento';
        break;
    }
  }

  scrollSelectedItemIntoView() {
    setTimeout(() => {
      const selectedItem = document.querySelector('.custom-menu-button.selected');
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }, 0); // Usamos setTimeout para asegurarnos de que el elemento esté renderizado antes de hacer scroll
  }

  /** ------------------------------------ Methods onClick ------------------------------------ **/
  onClickSideBar(sw: boolean) {
    this.open = sw;
  }

  onClickSetMenuSelected(eventTitle: string) {
    if (this.isOnline) {
      if (this.menuSelected !== eventTitle) {
        this.title = eventTitle;
        this.menuSelected = eventTitle;

        switch (eventTitle) {
          case 'Inicio':
            goInicio(this.router);
            break;

          case 'Artículos':
            //goShared(this.router);
            break;
        }
        this.scrollSelectedItemIntoView();
        this.open = false;
      }
    } else {
      console.log(eventTitle);
    }

    this.scrollSelectedItemIntoView();
    this.open = false;
  }

  onClickCerrarSesion() {
    if (localStorageLogOut()) {
      goLogin(this.router);
    }
  }

  /** ----------------------------------- Consultas Sevidor ----------------------------------- **/

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