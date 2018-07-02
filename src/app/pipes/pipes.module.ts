import { NgModule } from '@angular/core';
import { DaysBetweenPipe} from './days-between/days-between.pipe';
import { ConsultationPipe } from './consultation/consultation.pipe';
import { ValuesPipe } from './values/values.pipe';
import { DietPipe } from './diet/diet.pipe';

@NgModule({
  declarations: [DaysBetweenPipe, ConsultationPipe, ValuesPipe, DietPipe],
  imports: [],
  exports: [DaysBetweenPipe, ConsultationPipe, ValuesPipe, DietPipe]
})
export class PipesModule {
  static forRoot() {
    return {
      ngModule: PipesModule,
      providers: [DaysBetweenPipe, ConsultationPipe, ValuesPipe, DietPipe],
    };
  }
}
