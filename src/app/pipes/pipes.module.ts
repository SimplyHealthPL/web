import { NgModule } from '@angular/core';
import { DaysBetweenPipe} from './days-between/days-between.pipe';
import { ConsultationPipe } from './consultation/consultation.pipe';
@NgModule({
  declarations: [DaysBetweenPipe, ConsultationPipe],
  imports: [],
  exports: [DaysBetweenPipe, ConsultationPipe]
})
export class PipesModule {
  static forRoot() {
    return {
      ngModule: PipesModule,
      providers: [DaysBetweenPipe, ConsultationPipe],
    };
  }
}
