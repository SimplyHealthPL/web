import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pl';

@Pipe({
  name: 'daysBetween'
})
export class DaysBetweenPipe implements PipeTransform {

  transform(date: any, args?: any): any {
    if (date) {
      const a = moment();
      const b = moment(date, 'DD.MM.YYYY');
      const diff = a.diff(b, 'days');
      return args - diff;
    } else {
      return 0;
    }

  }

}
