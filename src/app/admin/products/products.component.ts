import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Element } from '../../../shared/element';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public addElement = false;
  public cols: any[];
  public msgs: Message[] = [];
  public elements = [];
  public elementsChoose = [];
  public diets = [];
  public addElementForm: FormGroup;
  public subscriptionElements;
  public isBusy = false;
  public newElement: Element;
  public error = '';
  public selectedElements = [];
  public recipe;
  public types: SelectItem[];
  public allergen;

  constructor( private data: DataServiceProvider, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.cols = [
      { field: 'name', header: 'Nazwa składnika' },
      { field: 'group', header: 'Typ składniku' },
      { field: 'values', header: 'Wartości odżywcze' },
      { field: 'button', header: '' }
    ];
    this.addElementForm = fb.group({
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
    this.subscriptionElements = this.data.getElements().subscribe(data => {
      this.elements = [];
      data.forEach(el => {
        this.elements.push({key: el.payload.key, ...el.payload.val()});
      });
    });
  }

  ngOnDestroy() {
    if (this.subscriptionElements) {
      this.subscriptionElements.unsubscribe();
    }
  }

  public doSignUp() {
    // Make sure form values are valid
    if (this.addElementForm.invalid) {
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;

    const formModel = this.addElementForm.value;
    // Grab values from form
    const name = formModel.name;
    const group = formModel.group;
    const allergen = this.allergen;
    const promotion =  formModel.promotion;
    const values =  formModel.values;

    this.newElement = {
      allergen,
      group,
      name,
      promotion,
      values
    };

    this.data.addElement(this.newElement).then(res => {
      if (res === true) {
        this.isBusy = false;
        this.addElementForm.reset();
        this.elementsChoose = [];
        this.msgs.push({severity: 'info', summary: 'Składnik dodany', detail: ''});
      } else {
        this.isBusy = false;
        this.error = 'Nieoczekiwany błąd.';
        this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      }
    });
  }

  public addItem(event, dd) {
    const repeat = this.elementsChoose.find((el) => {
      return el.name === event.value.name;
    });
    if (!repeat) {
      this.elementsChoose.push(event.value);
    }
    dd.resetFilter();
  }

  public removeItem(i) {
    this.elementsChoose.splice(i, 1);
  }

  public remove() {
    if (this.selectedElements.length > 0) {
      this.confirmationService.confirm({
        message: 'Na pewno chcesz usunąć te elementy?',
        header: 'Potwierdź usunięcie',
        accept: () => {
          const promises = [];
          this.selectedElements.forEach(el => {
            promises.push(this.data.deleteElement(el.key));
          });
          Promise.all(promises).then(() => {
            this.selectedElements = [];
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
