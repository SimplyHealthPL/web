import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import 'rxjs/add/operator/mergeMap';
import Chart from 'chart.js';
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

  constructor(private data: DataServiceProvider, private route: ActivatedRoute) {
    this.lifestyle = [
      { label: 'Siedzący', value: '0' },
      { label: 'Normalny', value: '1' },
      { label: 'Aktywny', value: '2' }
    ];
   }

  ngOnInit() {
    this.subscriptionUser = this.getUserId().flatMap((x) =>  this.getUser(x.id) )
                    .subscribe(user => {
                      this.user = user;
                      this.initChart(this.user.weight);
                    });

    this.subscriptionDiets = this.data.getDiets().subscribe(data => {
      this.diets = [];
      data.forEach(el => {
        const diet = { key: el.payload.key, ...el.payload.val()};
        this.diets.push({ label: el.payload.val().name, value: diet });
      });
    });
  }

  getUserId() {
    return this.route.params;
  }

  getUser(id) {
    this.userId = id;
    return this.data.getUserByKey(id);
  }

  initChart(weight) {
    const weightData = weight.map(el => {
      return {t: el.date, y: el.value};
    });
    const data = {
      datasets: [{
        label: 'Waga',
        borderColor: '#ffc107',
        backgroundColor: '#ffc107',
        fill: false,
        data: weightData,
        yAxisID: 'y-axis-1',
        }
    ]};
    const char = new Chart(this.chart.nativeElement, {
      type: 'line',
      data: data,
      options: {
        responsive: true,
        hoverMode: 'index',
        stacked: false,
        title: {
          display: false
        },
        scales: {
          yAxes: [{
            type: 'linear',
            display: true,
            position: 'left',
            id: 'y-axis-1',
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

  ngOnDestroy() {
    if (this.subscriptionUser) {
      this.subscriptionUser.unsubscribe();
    }
    if (this.subscriptionDiets) {
      this.subscriptionDiets.unsubscribe();
    }
  }

}
