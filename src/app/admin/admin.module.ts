import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminComponent } from './admin.component';
import {DataListModule} from 'primeng/datalist';
import {MenuModule} from 'primeng/menu';
import { AdminRoutingModule } from './admin.routing';
import { AdministrationGuard } from '../administration.guard';
import {EditorModule} from 'primeng/editor';
import { FormsModule } from '@angular/forms';
import {FileUploadModule} from 'primeng/fileupload';
import {GrowlModule} from 'primeng/growl';
import {ButtonModule} from 'primeng/button';
import {TabViewModule} from 'primeng/tabview';
import {InputTextModule} from 'primeng/inputtext';
import {CalendarModule} from 'primeng/calendar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import {OrderListModule} from 'primeng/orderlist';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { UsersComponent } from './users/users.component';
import { EventsComponent } from './events/events.component';
import { SchedulesComponent } from './schedules/schedules.component';
import { HappeningsComponent } from './happenings/happenings.component';
import { HotelsComponent } from './hotels/hotels.component';
import { RoomsComponent } from './rooms/rooms.component';
import { BusesComponent } from './buses/buses.component';
import { TravelsComponent } from './travels/travels.component';
import { ImportComponent } from './import/import.component';
import { OptionsComponent } from './options/options.component';

@NgModule({
  imports: [
    CommonModule,
    DataListModule,
    MenuModule,
    AdminRoutingModule,
    EditorModule,
    FormsModule,
    FileUploadModule,
    GrowlModule,
    ButtonModule,
    TabViewModule,
    InputTextModule,
    CalendarModule,
    BrowserAnimationsModule,
    BrowserModule,
    OrderListModule
  ],
  declarations: [AdminComponent, UsersComponent, EventsComponent,
    SchedulesComponent, HappeningsComponent, HotelsComponent,
    RoomsComponent, BusesComponent, TravelsComponent, ImportComponent,
    OptionsComponent],
  providers: [DataServiceProvider, AdministrationGuard]
})
export class AdminModule { }
