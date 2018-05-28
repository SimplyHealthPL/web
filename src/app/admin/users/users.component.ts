import { Component, OnInit } from '@angular/core';
import {Message} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {


  users = [];
  msgs: Message[];

  constructor( private data: DataServiceProvider) { }

  ngOnInit() {
    this.data.getUsers().subscribe(data => {
      this.users = data;
    });
  }

}
