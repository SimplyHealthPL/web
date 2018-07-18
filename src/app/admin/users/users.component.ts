import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, SelectItem, ConfirmationService} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../shared/user';
import * as moment from 'moment';
import 'moment/locale/pl';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit, OnDestroy {

  public addUser = false;
  public cols: any[];
  public users = [];
  public msgs: Message[] = [];
  public diet;
  public diets = [];
  public addUserForm: FormGroup;
  public subscriptionUsers;
  public subscriptionDiets;
  public isBusy = false;
  public unlike = [];
  public alergies = [];
  public restricted = [];
  public lifestyle: SelectItem[];
  public newUser: User;
  public error = '';
  public selectedUsers = [];

  constructor( private data: DataServiceProvider, private fb: FormBuilder, private confirmationService: ConfirmationService) {
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
        const diet = { key: el.payload.key, ...el.payload.val()};
        this.diets.push({ label: el.payload.val().name, value: diet });
      });
    });
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
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;

    const formModel = this.addUserForm.value;
    // Grab values from form
    const name = formModel.name;
    const surename = formModel.surename;
    const email = formModel.email;
    const age = formModel.age;
    const height = formModel.height;
    const weight = [{value: formModel.weight || '60', date: moment().format('DD.MM.YYYY')}];
    const weightPurpose = formModel.weightPurpose;
    const lifestyle = formModel.lifestyle;
    const unlike = this.unlike;
    const alergies = this.alergies;
    const restricted = this.restricted;
    const dietId =  this.diet.key || 0;
    const dietStart = moment().format('DD.MM.YYYY');

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
      dietStart,
      id: ''
    };

    this.data.addUser(this.newUser).then(res => {
      if (res === true) {
        this.isBusy = false;
        this.addUserForm.reset();
        this.msgs.push({severity: 'info', summary: 'Użytkownik dodany', detail: ''});
      } else {
        this.isBusy = false;
        this.error = 'Podany email jest używany przez innego użytkownika.';
        this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      }
    });
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

  public remove() {
    if (this.selectedUsers.length > 0) {
      this.confirmationService.confirm({
        message: 'Na pewno chcesz usunąć użytkowników?',
        header: 'Potwierdź usunięcie',
        accept: () => {
          const promises = [];
          this.selectedUsers.forEach(el => {
            promises.push(this.data.deleteUser(el.key, el.id));
          });
          Promise.all(promises).then(() => {
            this.selectedUsers = [];
            this.msgs.push({severity: 'info', summary: 'Użytkownicy usunięci', detail: ''});
          }).catch(e => {
            console.log(e);
            this.msgs.push({severity: 'error', summary: this.error, detail: ''});
          });
        },
        reject: () => {
            this.msgs = [{severity: 'info', summary: 'Anulowano usunięcie', detail: ''}];
        },
        acceptLabel: 'Potwierdź',
        rejectLabel: 'Anuluj'
    });
    }
  }

}
