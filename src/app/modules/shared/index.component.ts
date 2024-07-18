import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { arrayPreguntas } from 'src/app/common/utils/local/arrays/common.array';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent {

  selected: string='Selected';
  tabSelected: string='Selected';

  isOnline: boolean = true;

  data = arrayPreguntas;

  formLogin = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    texto: new FormControl('', [Validators.required]),
    selected: new FormControl('', [Validators.required]),
  });

  onClickLogin() { }

  onClickMenu(val: string) {
    this.selected = val;
  }

  onClickTab(val: string) {
    this.tabSelected = val;
  }
}
