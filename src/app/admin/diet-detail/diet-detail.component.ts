import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Diet } from '../../../shared/diet';


@Component({
  selector: 'app-diet-detail',
  templateUrl: './diet-detail.component.html',
  styleUrls: ['./diet-detail.component.scss']
})
export class DietDetailComponent implements OnInit, OnDestroy {

  public subscription;
  public diet: Diet;
  public dietId: string;
  public dishs = [];
  public cols: any[];
  public selectedDishs = [];
  public dishElements = {};
  public types: SelectItem[];
  public error = '';
  public msgs: Message[] = [];

  constructor(private data: DataServiceProvider, private route: ActivatedRoute,
    private confirmationService: ConfirmationService, private fb: FormBuilder) {
    this.cols = [
      { field: 'name', header: 'Nazwa dania' },
      { field: 'type', header: 'Typ posiłku' },
      { field: 'shoplist', header: 'Lista zakupów' }
    ];
    this.types = [
      { label: 'Śniadanie', value: '0' },
      { label: 'Drugie śniadanie', value: '1' },
      { label: 'Lunch', value: '2' },
      { label: 'Obiad', value: '3' },
      { label: 'Kolacja', value: '4' },
      { label: '-', value: null }
    ];
   }

  ngOnInit() {
    this.subscription = this.getDietId().flatMap((x) =>  this.getDiet(x.id) )
                                            .flatMap(diet => this.loadDishs(diet) )
                                            .subscribe(dishs => {
                                              this.filterDishs(dishs);
                                            });
  }

  public getDietId() {
    return this.route.params;
  }

  public getDiet(id) {
    this.dietId = id;
    return this.data.getDietByKey(id);
  }

  public loadDishs(data) {
    this.diet = data;
    return this.data.getDishs();
  }

  public filterDishs(data) {
    this.dishs = [];
    data.forEach(el => {
      if (this.diet.dishs) {
        this.diet.dishs.forEach(dishEl => {
          if (el.payload.key === dishEl.dishId) {
            const dish = {key: el.payload.key, ...el.payload.val()};
            this.dishElements[dish.key] = [];
            dish.elements.forEach(ele => {
              this.getItem(ele, dish.key);
            });
            this.dishs.push(dish);
          }
        });
      }
    });
  }

  public getElements(elements) {
    const eleNames = this.dishElements[elements].map(el => {
      return el.element.name;
    });
    let label = '';
    if (Array.isArray(eleNames)) {
      eleNames.forEach((el, index) => {
        if (index + 1 === eleNames.length) {
          label += el;
        } else {
          label += el + ', ';
        }
      });
    }
    return label;
  }

  async getItem(el, key) {
    const item = {element: {}, unit: {}, amount: 0};
    try {
     await this.data.getElement(el.elementId).subscribe(element => {
        item.element = element;
      });
     await this.data.getUnit(el.unitId).subscribe(unit => {
        item.unit = unit;
      });
      item.amount = el.amount;
      this.dishElements[key].push(item);
    } catch (e) {
      console.error(e);
    }
  }

  public remove() {
    if (this.selectedDishs.length > 0) {
      this.confirmationService.confirm({
        message: 'Na pewno chcesz usunąć te elementy?',
        header: 'Potwierdź usunięcie',
        accept: () => {
          this.selectedDishs.forEach(el => {
            this.diet.dishs = this.diet.dishs.filter(dish =>
             dish.dishId !== el.key
            );
          });
          this.data.updateDiet(this.diet, this.dietId).then(res => {
            if (res === true) {
              this.msgs.push({severity: 'info', summary: 'Dania usunięte z diety', detail: ''});
            } else {
              this.error = 'Nieoczekiwany błąd.';
              this.msgs.push({severity: 'error', summary: this.error, detail: ''});
            }
          });
        },
        reject: () => {
            this.msgs.push({severity: 'info', summary: 'Anulowano usunięcie', detail: ''});
        },
        acceptLabel: 'Potwierdź',
        rejectLabel: 'Anuluj'
    });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

}
