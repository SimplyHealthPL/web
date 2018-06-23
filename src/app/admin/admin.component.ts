import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {

  public items: MenuItem[];

  constructor() { }

  ngOnInit() {
    this.items = [{
      items: [
          {label: 'Pacjenci',  routerLink: '/admin/users', icon: 'icon users'},
          {label: 'Diety',  routerLink: '/admin/diets', icon: 'icon diets'},
          {label: 'Dania',  routerLink: '/admin/dishs', icon: 'icon dishs'},
          {label: 'Składniki',  routerLink: '/admin/products', icon: 'icon products'},
          {label: 'Kalendarz',  routerLink: '/admin/calendar', icon: 'icon calendar'}
      ]
  }];
  }

}
