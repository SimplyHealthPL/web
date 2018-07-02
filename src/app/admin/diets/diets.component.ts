import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Diet } from '../../../shared/diet';

@Component({
  selector: 'app-diets',
  templateUrl: './diets.component.html',
  styleUrls: ['./diets.component.scss']
})
export class DietsComponent implements OnInit, OnDestroy {

  public addDiet = false;
  public cols: any[];
  public msgs: Message[] = [];
  public dishs = [];
  public dishsChoose = [];
  public diets = [];
  public addDietForm: FormGroup;
  public subscriptionDiets;
  public subscriptionUsers;
  public subscriptionDishs;
  public isBusy = false;
  public newDiet: Diet;
  public error = '';
  public clientOnDiet = {};
  public desc = '';
  public selectedDiets = [];
  public elements = {};

  constructor( private data: DataServiceProvider, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.cols = [
      { field: 'name', header: 'Dieta' },
      { field: 'long', header: 'Długość diety' },
      { field: 'dishs', header: 'Ilość dodanych posiłków' },
      { field: 'clients', header: 'Ilość pacjentów na diecie' },
      { field: 'button', header: '' }
    ];
    this.addDietForm = fb.group({
      name: ['', Validators.required],
      long: ['', Validators.required]
    });
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
        this.dishs.push({ label: el.payload.val().name, value: dish });
      });
    });

    this.subscriptionUsers = this.data.getUsers().subscribe(data => {
      this.clientOnDiet = {};
      data.forEach(el => {
        const dId = el.payload.val().dietId;
        if (this.clientOnDiet.hasOwnProperty(dId)) {
          this.clientOnDiet[dId]++;
        } else {
          this.clientOnDiet[dId] = 1;
        }
      });
    });
  }

  ngOnDestroy() {
    if (this.subscriptionDiets) {
      this.subscriptionDiets.unsubscribe();
    }
    if (this.subscriptionUsers) {
      this.subscriptionUsers.unsubscribe();
    }
    if (this.subscriptionDishs) {
      this.subscriptionDishs.unsubscribe();
    }
  }

  public doSignUp() {
    // Make sure form values are valid
    if (this.addDietForm.invalid) {
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;

    const formModel = this.addDietForm.value;
    // Grab values from form
    const name = formModel.name;
    const long = formModel.long;
    const desc = this.desc;
    const dishs =  this.dishsChoose.map(el => ({dishId: el.key})) || [];

    this.newDiet = {
      name,
      long,
      desc,
      dishs
    };

    this.data.addDiet(this.newDiet).then(res => {
      if (res === true) {
        this.isBusy = false;
        this.addDietForm.reset();
        this.desc = '';
        this.dishsChoose = [];
        this.msgs.push({severity: 'info', summary: 'Dieta dodana', detail: ''});
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
    if (this.selectedDiets.length > 0) {
      this.confirmationService.confirm({
        message: 'Na pewno chcesz usunąć te elementy?',
        header: 'Potwierdź usunięcie',
        accept: () => {
          const promises = [];
          this.selectedDiets.forEach(el => {
            promises.push(this.data.deleteDiet(el.key));
          });
          Promise.all(promises).then(() => {
            this.selectedDiets = [];
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
