import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/pl';

@Pipe({
  name: 'consultation'
})
export class ConsultationPipe implements PipeTransform {

  transform(calendar: any, args?: any): any {
    const a = moment();
    let consultation = 0;
    calendar.forEach(event => {
      const b = moment(event.date, 'DD.MM.YYYY');
      const diff = a.diff(b, 'days');
      if (diff > 0 && event.type === 'wizyta') {
        consultation++;
      }
    });
    return consultation;
  }

}
