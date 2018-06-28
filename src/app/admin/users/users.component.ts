import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../shared/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public addUser = false;
  public cols: any[];
  public users = [];
  public msgs: Message[];
  public diet;
  public diets = [];
  public addUserForm: FormGroup;
  public subscriptionUsers;
  public subscriptionDiets;
  public isBusy = false;
  public hasFailed = false;
  public showInputErrors = false;
  public unlike = [];
  public alergies = [];
  public restricted = [];
  public lifestyle: SelectItem[];
  public newUser: User;

  constructor( private data: DataServiceProvider, private fb: FormBuilder) {
    this.addUserForm = fb.group({
      name: ['', Validators.required],
      surename: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      age: [''],
      height: [''],
      weight: [''],
      weightPurpose: [''],
      lifestyle: ['']
    });
   }

  ngOnInit() {
    this.subscriptionUsers = this.data.getUsers().subscribe(data => {
      this.users = [];
      data.forEach(el => {
        this.users.push({key: el.payload.key, ...el.payload.val()});
      });
    });

    this.subscriptionDiets = this.data.getDiets().subscribe(data => {
      this.diets = [];
      data.forEach(el => {
        this.diets.push({ label: el.payload.val().name, value: el.payload.key });
      });
    });

    this.cols = [
      { field: 'name', header: 'Imie i nazwisko' },
      { field: 'dietTime', header: 'Pozostałe dni na diecie' },
      { field: 'diet', header: 'Obecna dieta' },
      { field: 'consultation', header: 'Ilość odbytych konsultacji' },
      { field: 'button', header: '' }
    ];

    this.lifestyle = [
      { label: '-', value: null },
      { label: 'Siedzący', value: '0' },
      { label: 'Normalny', value: '1' },
      { label: 'Aktywny', value: '2' }
    ];

  }

  ngOnDestroy() {
    if (this.subscriptionUsers) {
      this.subscriptionUsers.unsubscribe();
    }
    if (this.subscriptionDiets) {
      this.subscriptionDiets.unsubscribe();
    }
  }

  public doSignUp() {
    // Make sure form values are valid
    if (this.addUserForm.invalid) {
      this.showInputErrors = true;
      return;
    }

    // Reset status
    this.isBusy = true;
    this.hasFailed = false;

    const formModel = this.addUserForm.value;
    // Grab values from form
    const name = formModel.name;
    const surename = formModel.surename;
    const email = formModel.email;
    const age = formModel.age;
    const height = formModel.height;
    const weight = formModel.weight;
    const weightPurpose = formModel.weightPurpose;
    const lifestyle = formModel.lifestyle;
    const unlike = this.unlike;
    const alergies = this.alergies;
    const restricted = this.restricted;
    const dietId =  this.diet;

    this.newUser = {
      name,
      surename,
      email,
      age,
      height,
      weight,
      weightPurpose,
      lifestyle,
      unlike,
      alergies,
      restricted,
      dietId,
      id: ''
    };

    const result = this.data.addUser(this.newUser);
    console.log(result);

    // Submit request to API
   // this.login(username, password);
  }

  public addItem(event, list, input) {
    if (event.keyCode === 13 && input.value !== '') {
      switch (list) {
        case 'unlike': {
          this.unlike.push(input.value);
          input.value = '';
          break;
        }
        case 'alergies': {
          this.alergies.push(input.value);
          input.value = '';
          break;
        }
        case 'restricted': {
          this.restricted.push(input.value);
          input.value = '';
          break;
        }
      }
    }
  }

  public removeItem(i, list) {
    switch (list) {
      case 'unlike': {
        this.unlike.splice(i, 1);
        break;
      }
      case 'alergies': {
        this.alergies.splice(i, 1);
        break;
      }
      case 'restricted': {
        this.restricted.splice(i, 1);
        break;
      }
    }
  }

}
