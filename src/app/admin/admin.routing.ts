import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { AdministrationGuard } from '../administration.guard';
import { AdminComponent } from './admin.component';
import { UsersComponent } from './users/users.component';
import { DietsComponent } from './diets/diets.component';
import { DishsComponent } from './dishs/dishs.component';
import { ProductsComponent } from './products/products.component';
import { CalendarComponent } from './calendar/calendar.component';

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
              {path: '', redirectTo: 'users', pathMatch: 'full'},
              {path: 'users', component: UsersComponent},
              {path: 'diets', component: DietsComponent},
              {path: 'dishs', component: DishsComponent},
              {path: 'products', component: ProductsComponent},
              {path: 'calendar', component: CalendarComponent}
            ]
        }
    ])
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
