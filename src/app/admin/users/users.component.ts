import { Component, OnInit } from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  addUser = false;
  cols: any[];
  users = [];
  msgs: Message[];
  diets: SelectItem[];

  constructor( private data: DataServiceProvider) { }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
      this.users = data;
    });

    this.cols = [
      { field: 'name', header: 'Imie i nazwisko' },
      { field: 'dietTime', header: 'Pozostałe dni na diecie' },
      { field: 'diet', header: 'Obecna dieta' },
      { field: 'consultation', header: 'Ilość odbytych konsultacji' },
      { field: 'button', header: '' }
    ];

    this.diets = [
      { label: 'Wszystkie', value: null },
      { label: 'Dieta 1000 kalorii', value: 'Dieta 1000 kalorii' }
    ];
  }

}
