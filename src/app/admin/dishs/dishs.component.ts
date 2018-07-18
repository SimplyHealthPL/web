import { Component, OnInit, OnDestroy } from '@angular/core';
import {Message, ConfirmationService, SelectItem} from 'primeng/api';
import { DataServiceProvider } from '../../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dish } from '../../../shared/dish';
import { AngularFireStorage } from 'angularfire2/storage';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dishs',
  templateUrl: './dishs.component.html',
  styleUrls: ['./dishs.component.scss']
})
export class DishsComponent implements OnInit, OnDestroy {

  public addDish = false;
  public editDish = false;
  public cols: any[];
  public msgs: Message[] = [];
  public dishs = [];
  public elementsChoose = [];
  public dietsChoose = [];
  public diets = [];
  public addDishForm: FormGroup;
  public subscriptionDishs;
  public subscriptionDiets;
  public subscriptionElements;
  public subscriptionUnits;
  public isBusy = false;
  public newDish: Dish;
  public error = '';
  public clientOnDish = {};
  public desc = '';
  public selectedDishs = [];
  public dishElements = {};
  public recipe;
  public types: SelectItem[];
  public elementsAll = [];
  public units: SelectItem[];
  public steps = [];
  public downloadURL: Observable<any>;
  public percentage: Observable<number>;
  public snapshot: Observable<any>;
  public task: any;
  public editDishImageUrl: string;
  public editDishId = '';

  constructor( private data: DataServiceProvider,
              private fb: FormBuilder,
              private confirmationService: ConfirmationService,
              private storage: AngularFireStorage) {
    this.cols = [
      { field: 'name', header: 'Nazwa dania' },
      { field: 'type', header: 'Typ posiłku' },
      { field: 'shoplist', header: 'Lista zakupów' },
      { field: 'button', header: '' }
    ];
    this.addDishForm = fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required]
    });
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
    this.subscriptionDiets = this.data.getDiets().subscribe(data => {
      this.diets = [];
      data.forEach(el => {
        const diet = {key: el.payload.key, ...el.payload.val()};
        this.diets.push({ label: el.payload.val().name, value: diet });
      });
    });

    this.subscriptionDishs = this.data.getDishs().subscribe(data => {
      this.dishs = [];
      data.forEach(el => {
        const dish = {key: el.payload.key, ...el.payload.val()};
        this.dishElements[dish.key] = [];
        dish.elements.forEach(ele => {
          this.getItem(ele, dish.key);
        });
        this.dishs.push(dish);
      });
    });

    this.subscriptionElements = this.data.getElements().subscribe(data => {
      this.elementsAll = [];
      data.forEach(el => {
        const element = {key: el.payload.key, ...el.payload.val()};
        this.elementsAll.push({ label: el.payload.val().name, value: element });
      });
    });

    this.subscriptionUnits = this.data.getUnits().subscribe(data => {
      this.units = [];
      data.forEach(el => {
        const unit = {key: el.payload.key, ...el.payload.val()};
        this.units.push({ label: el.payload.val().name, value: unit });
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
    if (this.subscriptionUnits) {
      this.subscriptionUnits.unsubscribe();
    }
    if (this.subscriptionElements) {
      this.subscriptionElements.unsubscribe();
    }
  }

  public makeDish() {
    // Make sure form values are valid
    if (this.addDishForm.invalid) {
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    if (this.steps.length === 0) {
      this.error = 'Dodaj przepis.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    if (this.downloadURL === undefined ) {
      this.error = 'Dodaj zdjęcie';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    if (this.elementsChoose.length === 0) {
      this.error = 'Dodaj składnik';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;

    this.downloadURL.toPromise().then(url => {

      const formModel = this.addDishForm.value;
      const name = formModel.name;
      const type = [formModel.type] || [];
      const image = url;
      const elements = [];
      const recipe = {
        des: this.desc,
        steps: []
      };
      this.steps.forEach(step => {
        recipe.steps.push(step.desc);
      });
      this.elementsChoose.forEach(el => {
        elements.push({
          amount: el.quanity,
          elementId: el.key,
          unitId: el.unit.key
        });
      });

      this.newDish = {
        name,
        image,
        elements,
        recipe,
        type
      };
      this.data.addDish(this.newDish).then(res => {
        if (res) {
          if (this.dietsChoose.length > 0) {
            this.dietsChoose.forEach(diet => {
              const dishs = diet.dishs;
              dishs.push({dishId: res});
              const updateDiet = {
                desc: diet.desc,
                dishs: dishs,
                long: diet.long,
                name: diet.name
              };
              this.data.updateDiet(updateDiet, diet.key);
            });
          }
          this.isBusy = false;
          this.addDishForm.reset();
          this.desc = '';
          this.elementsChoose = [];
          this.steps = [];
          this.dietsChoose = [];
          this.downloadURL = undefined;
          this.percentage = undefined;
          this.msgs.push({severity: 'info', summary: 'Danie dodane', detail: ''});
        } else {
          this.isBusy = false;
          this.error = 'Nieoczekiwany błąd.';
          this.msgs.push({severity: 'error', summary: this.error, detail: ''});
        }
      });
    });
  }

  public addElement(event, dd) {
    const repeat = this.elementsChoose.find((el) => {
      return el.name === event.value.name;
    });
    if (!repeat) {
      this.elementsChoose.push({ quanity: 0, unit: '', ...event.value});
    }
    dd.resetFilter();
  }

  public removeElement(i) {
    this.elementsChoose.splice(i, 1);
  }

  public addDiet(event, dd) {
    const repeat = this.dietsChoose.find((el) => {
      return el.name === event.value.name;
    });
    if (!repeat) {
      this.dietsChoose.push(event.value);
    }
    dd.resetFilter();
  }

  public removeDiet(i) {
    this.dietsChoose.splice(i, 1);
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
            this.msgs.push({severity: 'info', summary: 'Dania usunięte', detail: ''});
          }).catch(e => {
            console.log(e);
            this.msgs.push({severity: 'error', summary: this.error, detail: ''});
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

  public close(event, input, inplace) {
    if (event.keyCode === 13 && input.value !== '') {
      inplace.deactivate(event);
    }
  }

  public upload(event) {
    const file = event.target.files[0];
    const filePath = `dishs/${new Date().getTime()}_${file.name}`;
    const fileRef = this.storage.ref(filePath);
    this.task = this.storage.upload(filePath, file);
    this.percentage = this.task.percentageChanges();
    this.snapshot   = this.task.snapshotChanges();
    this.task.snapshotChanges().toPromise().then(() => {
      this.downloadURL = fileRef.getDownloadURL();
      this.editDishImageUrl = undefined;
      this.msgs.push({severity: 'success', summary: 'Zdjęcie dodane', detail: ''});
    });

  }

  public addStep() {
    this.steps.push({desc: ''});
  }

  public removeStep() {
    this.steps.pop();
  }

  public editDishInit(dishData) {
    this.addDish = false;
    this.steps = [];
    this.elementsChoose = [];
    this.editDish = true;
    this.editDishId = dishData.key;
    const dish = {
      name: dishData.name,
      type: dishData.type[0]
    };
    this.addDishForm.setValue(dish);
    dishData.recipe.steps.forEach(step => {
      this.steps.push({desc: step});
    });
    this.desc = dishData.recipe.des;
    this.editDishImageUrl = dishData.image;
    dishData.elements.forEach(el => {
      const elementAdded = this.elementsAll.find(elS => {
        return elS.value.key === el.elementId.toString();
      });
      const unitAdded = this.units.find(unit => {
        return unit.value.key === el.unitId.toString();
      });
      this.elementsChoose.push({ quanity: el.amount, unit: unitAdded.value, ...elementAdded.value});
    });
  }

  public reset() {
    this.isBusy = false;
    this.addDishForm.reset();
    this.desc = '';
    this.elementsChoose = [];
    this.steps = [];
    this.downloadURL = undefined;
    this.percentage = undefined;
    this.editDishImageUrl = undefined;
  }

  public showAdd() {
    if (this.editDish !== true) { this.addDish = true; }
  }

  public updateDish(update = false) {
    console.log(update);
    // Make sure form values are valid
    if (this.addDishForm.invalid) {
      this.error = 'Uzupełnij wymagane pola.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    if (this.steps.length === 0) {
      this.error = 'Dodaj przepis.';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    if (this.elementsChoose.length === 0) {
      this.error = 'Dodaj składnik';
      this.msgs.push({severity: 'error', summary: this.error, detail: ''});
      return;
    }

    // Reset status
    this.error = '';
    this.isBusy = true;


    if (this.downloadURL === undefined ) {
      const formModel = this.addDishForm.value;
      const name = formModel.name;
      const type = [formModel.type] || [];
      const image = this.editDishImageUrl;
      const elements = [];
      const recipe = {
        des: this.desc,
        steps: []
      };
      this.steps.forEach(step => {
        recipe.steps.push(step.desc);
      });
      this.elementsChoose.forEach(el => {
        elements.push({
          amount: el.quanity,
          elementId: el.key,
          unitId: el.unit.key
        });
      });

      this.newDish = {
        name,
        image,
        elements,
        recipe,
        type
      };
        this.data.updateDish(this.newDish, this.editDishId).then(res => {
          if (res === true) {
            this.isBusy = false;
            this.percentage = undefined;
            this.msgs.push({severity: 'info', summary: 'Danie dodane', detail: ''});
          } else {
            this.isBusy = false;
            this.error = 'Nieoczekiwany błąd.';
            this.msgs.push({severity: 'error', summary: this.error, detail: ''});
          }
        });
    } else {
      this.downloadURL.toPromise().then(url => {

        const formModel = this.addDishForm.value;
        const name = formModel.name;
        const type = [formModel.type] || [];
        const image = url;
        const elements = [];
        const recipe = {
          des: this.desc,
          steps: []
        };
        this.steps.forEach(step => {
          recipe.steps.push(step.desc);
        });
        this.elementsChoose.forEach(el => {
          elements.push({
            amount: el.quanity,
            elementId: el.key,
            unitId: el.unit.key
          });
        });

        this.newDish = {
          name,
          image,
          elements,
          recipe,
          type
        };
          this.data.updateDish(this.newDish, this.editDishId).then(res => {
            if (res === true) {
              this.isBusy = false;
              this.downloadURL = undefined;
              this.percentage = undefined;
              this.msgs.push({severity: 'info', summary: 'Danie dodane', detail: ''});
            } else {
              this.isBusy = false;
              this.error = 'Nieoczekiwany błąd.';
              this.msgs.push({severity: 'error', summary: this.error, detail: ''});
            }
          });

      });
    }
  }

}
