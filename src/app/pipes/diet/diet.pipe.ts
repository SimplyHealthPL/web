import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'diet'
})
export class DietPipe implements PipeTransform {

  transform(diets: Array<any>, key: any, label = true): any {
    if (diets.length > 0) {
      const diet = diets.find(el => {
        return el.value.key === key;
      });
      if (label === true) {
        return diet.label;
      } else {
        return diet.value.long;
      }

    }
  }

}
