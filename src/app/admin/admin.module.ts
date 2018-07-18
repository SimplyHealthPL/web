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
import { DietsComponent } from './diets/diets.component';
import { DishsComponent } from './dishs/dishs.component';
import { ProductsComponent } from './products/products.component';
import { CalendarComponent } from './calendar/calendar.component';
import { DietDetailComponent } from './diet-detail/diet-detail.component';
import {TableModule} from 'primeng/table';
import {DropdownModule} from 'primeng/dropdown';
import { PipesModule } from '../pipes/pipes.module';
import {DialogModule} from 'primeng/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ChipsModule} from 'primeng/chips';
import {TooltipModule} from 'primeng/tooltip';
import {ScrollPanelModule} from 'primeng/scrollpanel';
import {InputTextareaModule} from 'primeng/inputtextarea';
import {ConfirmDialogModule} from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { UserDetailComponent } from './user-detail/user-detail.component';
import {AccordionModule} from 'primeng/accordion';
import {InplaceModule} from 'primeng/inplace';
import {KeyFilterModule} from 'primeng/keyfilter';
import {InputSwitchModule} from 'primeng/inputswitch';
import {MultiSelectModule} from 'primeng/multiselect';

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
    OrderListModule,
    TableModule,
    DropdownModule,
    DialogModule,
    PipesModule.forRoot(),
    ReactiveFormsModule,
    AutoCompleteModule,
    ChipsModule,
    TooltipModule,
    ScrollPanelModule,
    InputTextareaModule,
    ConfirmDialogModule,
    AccordionModule,
    InplaceModule,
    KeyFilterModule,
    InputSwitchModule,
    MultiSelectModule
  ],
  declarations: [AdminComponent, UsersComponent, DietsComponent, DishsComponent,
    ProductsComponent, CalendarComponent, UserDetailComponent, DietDetailComponent],
  providers: [DataServiceProvider, AdministrationGuard, ConfirmationService]
})
export class AdminModule { }
