import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { ActivatedRoute } from '@angular/router';
import {Message} from 'primeng/api';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/mergeMap';
import Chart from 'chart.js';
import * as moment from 'moment';
// import { User } from '../../../shared/user';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styleUrls: ['./user-detail.component.scss']
})
export class UserDetailComponent implements OnInit, OnDestroy {

  @ViewChild('chart') chart: ElementRef;

  public user: any;
  public userId: any;
  public subscriptionUser;
  public subscriptionDiets;
  public lifestyle = [];
  public diets = [];
  public weightChart: any;
  public editUser = false;
  public editUserForm: FormGroup;
  public msgs: Message[] = [];
  public diet;
  public isBusy = false;
  public error = '';
  public date: any;

  constructor(private data: DataServiceProvider, private route: ActivatedRoute, private fb: FormBuilder) {
    this.lifestyle = [
      { label: 'Siedzący', value: '0' },
      { label: 'Normalny', value: '1' },
      { label: 'Aktywny', value: '2' }
    ];
    this.editUserForm = fb.group({
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
    this.initChart();
    this.subscriptionUser = this.getUserId().flatMap((x) =>  this.getUser(x.id) )
                    .subscribe(user => {
                      this.user = user;
                      this.updateChart();
                      this.updateForm();
                    });
    this.subscriptionDiets = this.data.getDiets().subscribe(data => this.getDiets(data));
  }

  getUserId() {
    return this.route.params;
  }

  getUser(id) {
    this.userId = id;
    return this.data.getUserByKey(id);
  }

  getDiets(data) {
    this.diets = [];
    data.forEach(el => {
      const diet = { key: el.payload.key, ...el.payload.val()};
      this.diets.push({ label: el.payload.val().name, value: diet });
    });
    const dietChoose = this.diets.find(el => {
      return el.value.key === this.user.dietId;
    });
    this.diet = dietChoose.value;
  }

  initChart() {
    const data = {
      datasets: [{
        label: 'Waga',
        borderColor: '#0ab6a2',
        backgroundColor: '#fff',
        fill: false,
        data: [],
        yAxisID: 'y-axis-1',
        }
    ]};
    this.weightChart = new Chart(this.chart.nativeElement, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        legend: {
          display: false
        },
        title: {
          display: true,
          text: 'Wykres wagi',
          fontSize: 18,
          fontColor: '#e67e22',
          fontStyle: 'normal',
          fontFamily: 'FiraSansLight',
          padding: 20
        },
        scales: {
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1'
          }],
          xAxes: [{
            type: 'time',
            time: {
              unit: 'day',
              parser: 'DD.MM.YYYY'
            }
        }]
        }
      }
    });
  }

  updateChart() {
    const weightData = this.user.weight.map(el => {
      return {t: el.date, y: el.value};
    });
    this.weightChart.data.datasets[0].data = weightData;
    this.weightChart.update();
  }

  updateForm() {
    const user = {
      name: this.user.name,
      surename: this.user.surename,
      email: this.user.email,
      age: this.user.age,
      height: this.user.height,
      weight: this.user.weight[0].value,
      weightPurpose: this.user.weightPurpose,
      lifestyle: this.user.lifestyle
    };
    this.editUserForm.setValue(user);
    if (this.user.unlike === undefined) {
      this.user.unlike = [];
    }
    if (this.user.alergies === undefined) {
      this.user.alergies = [];
    }
    if (this.user.restricted === undefined) {
      this.user.restricted = [];
    }
    this.date = moment(this.user.dietStart, 'DD.MM.YYYY').toDate();
  }

  public addItem(event, list, input) {
    if (event.keyCode === 13 && input.value !== '') {
      switch (list) {
        case 'unlike': {
          this.user.unlike.push(input.value);
          input.value = '';
          break;
        }
        case 'alergies': {
          this.user.alergies.push(input.value);
          input.value = '';
          break;
        }
        case 'restricted': {
          this.user.restricted.push(input.value);
          input.value = '';
          break;
        }
      }
    }
  }

  public removeItem(i, list) {
    switch (list) {
      case 'unlike': {
        this.user.unlike.splice(i, 1);
        break;
      }
      case 'alergies': {
        this.user.alergies.splice(i, 1);
        break;
      }
      case 'restricted': {
        this.user.restricted.splice(i, 1);
        break;
      }
    }
  }

  public doSignUp() {
    // Make sure form values are valid
    if (this.editUserForm.invalid) {
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;

    const formModel = this.editUserForm.value;
    // Grab values from form
    const name = formModel.name;
    const surename = formModel.surename;
    const email = formModel.email;
    const age = formModel.age;
    const height = formModel.height;
    this.user.weight[0].value = formModel.weight || '60';
    const weightPurpose = formModel.weightPurpose;
    const lifestyle = formModel.lifestyle;
    const unlike = this.user.unlike || [];
    const alergies = this.user.alergies || [];
    const restricted = this.user.restricted || [];
    const dietId =  this.diet.key || 0;
    const dietStart = moment(this.date).format('DD.MM.YYYY');

    const editedUser = {
      name,
      surename,
      email,
      age,
      height,
      weight: this.user.weight,
      weightPurpose,
      lifestyle,
      unlike,
      alergies,
      restricted,
      dietId,
      dietStart,
      id: ''
    };

    this.data.updateUser(editedUser, this.userId).then(res => {
      if (res === true) {
        this.isBusy = false;
        this.updateForm();
        this.msgs.push({severity: 'info', summary: 'Użytkownik edytowany', detail: ''});
      } else {
        this.isBusy = false;
        this.error = 'Nieoczekiwany błąd';
        this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      }
    });
  }

  ngOnDestroy() {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
    if (this.subscriptionDiets) {
      this.subscriptionDiets.unsubscribe();
    }
  }

}
