import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  transform(elements: any, args?: any): any {
    console.log(elements);
    if (elements.length > 0) {
      const values = {carb: 0, fat: 0, protein: 0, calories: 0};
      elements.forEach(el => {
        values.carb += el.element.values.carb * el.amount * el.unit.scale;
        values.fat += el.element.values.fat * el.amount * el.unit.scale;
        values.protein += el.element.values.protein * el.amount * el.unit.scale;
        values.calories += el.element.values.calories * el.amount * el.unit.scale;
      });
      return values[args];
    }

  }

}
