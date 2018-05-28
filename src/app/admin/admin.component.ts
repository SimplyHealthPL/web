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
      label: 'Menu',
      items: [
          {label: 'Użytkownicy',  routerLink: '/admin/users'},
          {label: 'Event',  routerLink: '/admin/events'},
          {label: 'Terminarze',  routerLink: '/admin/schedules'},
          {label: 'Wydarzenia',  routerLink: '/admin/happenings'},
          {label: 'Hotele',  routerLink: '/admin/hotels'},
          {label: 'Sale',  routerLink: '/admin/rooms'},
          {label: 'Autokary',  routerLink: '/admin/buses'},
          {label: 'Podróże',  routerLink: '/admin/travels'},
          {label: 'Import',  routerLink: '/admin/import'},
          {label: 'Ustawienia',  routerLink: '/admin/options'}
      ]
  }];
  }

}
