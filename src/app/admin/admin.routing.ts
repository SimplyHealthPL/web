import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AdministrationGuard } from '../administration.guard';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { BusesComponent } from './buses/buses.component';
import { EventsComponent } from './events/events.component';
import { HappeningsComponent } from './happenings/happenings.component';
import { HotelsComponent } from './hotels/hotels.component';
import { ImportComponent } from './import/import.component';
import { OptionsComponent } from './options/options.component';
import { RoomsComponent } from './rooms/rooms.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { TravelsComponent } from './travels/travels.component';

// Utwórz moduł routingu projektu.
@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: 'admin',
            component: AdminComponent,
            canActivate: [
              AdministrationGuard
            ],
            children: [
              {path: '', redirectTo: 'list', pathMatch: 'full'},
              {path: 'users', component: UsersComponent},
              {path: 'buses', component: BusesComponent},
              {path: 'events', component: EventsComponent},
              {path: 'happenings', component: HappeningsComponent},
              {path: 'hotels', component: HotelsComponent},
              {path: 'import', component: ImportComponent},
              {path: 'options', component: OptionsComponent},
              {path: 'rooms', component: RoomsComponent},
              {path: 'schedules', component: SchedulesComponent},
              {path: 'travels', component: TravelsComponent}
            ]
        }
    ])
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
