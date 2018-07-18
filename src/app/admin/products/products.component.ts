import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Element } from '../../../shared/element';
import { Groups } from '../../../shared/groups';


@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit, OnDestroy {

  public addElement = false;
  public editElement = false;
  public cols: any[];
  public msgs: Message[] = [];
  public elements = [];
  public addElementForm: FormGroup;
  public subscriptionElements;
  public isBusy = false;
  public newElement: Element;
  public error = '';
  public selectedElements = [];
  public types: SelectItem[];
  public allergen = [];
  public editElementId = '';

  constructor( private data: DataServiceProvider, private fb: FormBuilder, private confirmationService: ConfirmationService) {
    this.cols = [
      { field: 'name', header: 'Nazwa składnika' },
      { field: 'group', header: 'Typ składniku' },
      { field: 'values', header: 'Wartości odżywcze' },
      { field: 'button', header: '' }
    ];
    this.addElementForm = fb.group({
      name: ['', Validators.required],
      energy: ['', Validators.required],
      sugar: ['', Validators.required],
      protein: ['', Validators.required],
      fat: ['', Validators.required],
      type: ['', Validators.required]
    });
    this.types = [...Groups];
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
    const group = formModel.type;
    const allergen = this.allergen;
    const promotion =  formModel.promotion || 0;
    const values =  {
      calories: formModel.energy,
      carb: formModel.sugar,
      fat: formModel.fat,
      protein: formModel.protein
    };

    this.newElement = {
      allergen,
      group,
      name,
      promotion,
      values
    };

    if (!this.editElement) {
      this.data.addElement(this.newElement).then(res => {
        if (res === true) {
          this.isBusy = false;
          this.addElementForm.reset();
          this.allergen = [];
          this.msgs.push({severity: 'info', summary: 'Składnik dodany', detail: ''});
        } else {
          this.isBusy = false;
          this.error = 'Nieoczekiwany błąd.';
          this.msgs.push({severity: 'error', summary: this.error, detail: ''});
        }
      });
    } else {
      this.data.updateElement(this.newElement, this.editElementId).then(res => {
        if (res === true) {
          this.isBusy = false;
          this.addElement = false;
          this.editElement = false;
          this.editElementId = '';
          this.addElementForm.reset();
          this.allergen = [];
          this.msgs.push({severity: 'info', summary: 'Składnik zmieniony', detail: ''});
        } else {
          this.isBusy = false;
          this.error = 'Nieoczekiwany błąd.';
          this.msgs.push({severity: 'error', summary: this.error, detail: ''});
        }
      });
    }
  }

  public addItem(event, list, input) {
    if (event.keyCode === 13 && input.value !== '') {
      switch (list) {
        case 'allergen': {
          this.allergen.push(input.value);
          input.value = '';
          break;
        }
      }
    }
  }

  public removeItem(i, list) {
    switch (list) {
      case 'allergen': {
        this.allergen.splice(i, 1);
        break;
      }
    }
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

  public getType(types) {
    let label = '';
    if (Array.isArray(types)) {
      types.forEach((el, index) => {
        if (index + 1 === types.length) {
          label += this.types[el].label;
        } else {
          label += this.types[el].label + ', ';
        }
      });
    } else {
      label = types;
    }
    return label;
  }

  public getValues(values) {
    const label = `Kalorie - ${values.calories} kcl
      Węglowodany - ${values.carb} g
      Tłuszcze - ${values.fat} g
      Białko - ${values.protein} g
    `;
    return label;
  }

  public editElementInit(elementData) {
    this.addElement = true;
    this.allergen = elementData.allergen;
    this.editElement = true;
    this.editElementId = elementData.key;
    const element = {
      name: elementData.name,
      type: elementData.group,
      energy: elementData.values.calories,
      sugar: elementData.values.carb,
      protein: elementData.values.protein,
      fat: elementData.values.fat
    };
    this.addElementForm.setValue(element);
  }

}
