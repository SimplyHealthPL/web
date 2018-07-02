import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../../../shared/dish';


@Component({
  selector: 'app-dishs',
  templateUrl: './dishs.component.html',
  styleUrls: ['./dishs.component.scss']
})
export class DishsComponent implements OnInit, OnDestroy {

  public addDish = false;
  public cols: any[];
  public msgs: Message[] = [];
  public dishs = [];
  public dishsChoose = [];
  public diets = [];
  public addDishForm: FormGroup;
  public subscriptionDishs;
  public subscriptionDiets;
  public isBusy = false;
  public newDish: Dish;
  public error = '';
  public clientOnDish = {};
  public desc = '';
  public selectedDishs = [];
  public elements = {};
  public recipe;
  public types: SelectItem[];

  constructor( private data: DataServiceProvider, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.cols = [
      { field: 'name', header: 'Nazwa dania' },
      { field: 'type', header: 'Typ posiłku' },
      { field: 'diets', header: 'Dieta' },
      { field: 'shoplist', header: 'Lista zakupów' },
      { field: 'button', header: '' }
    ];
    this.addDishForm = fb.group({
      name: ['', Validators.required],
      image: ['', Validators.required],
      type: ['']
    });
    this.types = [
      { label: '-', value: null },
      { label: 'Śniadanie', value: '0' },
      { label: 'Drugie śniadanie', value: '1' },
      { label: 'Lunch', value: '2' },
      { label: 'Obiad', value: '3' },
      { label: 'Kolacja', value: '4' }
    ];
   }

  ngOnInit() {
    this.subscriptionDiets = this.data.getDiets().subscribe(data => {
      this.diets = [];
      data.forEach(el => {
        this.diets.push({key: el.payload.key, ...el.payload.val()});
      });
    });

    this.subscriptionDishs = this.data.getDishs().subscribe(data => {
      this.dishs = [];
      data.forEach(el => {
        const dish = {key: el.payload.key, ...el.payload.val()};
        this.elements[dish.key] = [];
        dish.elements.forEach(ele => {
          this.getItem(ele, dish.key);
        });
        this.dishs.push(dish);
      });
    });
  }

  ngOnDestroy() {
    if (this.subscriptionDiets) {
      this.subscriptionDiets.unsubscribe();
    }
    if (this.subscriptionDishs) {
      this.subscriptionDishs.unsubscribe();
    }
  }

  public doSignUp() {
    // Make sure form values are valid
    if (this.addDishForm.invalid) {
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;

    const formModel = this.addDishForm.value;
    // Grab values from form
    const name = formModel.name;
    const image = formModel.image;
    const elements = this.elements;
    const recipe =  this.recipe || [];
    const type =  formModel.type || [];

    this.newDish = {
      name,
      image,
      elements,
      recipe,
      type
    };

    this.data.addDish(this.newDish).then(res => {
      if (res === true) {
        this.isBusy = false;
        this.addDishForm.reset();
        this.desc = '';
        this.dishsChoose = [];
        this.msgs.push({severity: 'info', summary: 'Disha dodana', detail: ''});
      } else {
        this.isBusy = false;
        this.error = 'Nieoczekiwany błąd.';
        this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      }
    });
  }

  public addItem(event, dd) {
    const repeat = this.dishsChoose.find((el) => {
      return el.name === event.value.name;
    });
    if (!repeat) {
      this.dishsChoose.push(event.value);
    }
    dd.resetFilter();
  }

  public removeItem(i) {
    this.dishsChoose.splice(i, 1);
  }

  public remove() {
    if (this.selectedDishs.length > 0) {
      this.confirmationService.confirm({
        message: 'Na pewno chcesz usunąć te elementy?',
        header: 'Potwierdź usunięcie',
        accept: () => {
          const promises = [];
          this.selectedDishs.forEach(el => {
            promises.push(this.data.deleteDish(el.key));
          });
          Promise.all(promises).then(() => {
            this.selectedDishs = [];
            this.msgs.push({severity: 'info', summary: 'Diety usunięte', detail: ''});
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
      this.elements[key].push(item);
    } catch (e) {
      console.error(e);
    }
  }

}
