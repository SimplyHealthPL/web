import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { LoginRoutingModule } from './login.routing';
import { AuthService } from '../../providers/auth/auth.service';
import { SessionService } from '../../providers/session/session.service';
import { DataServiceProvider } from '../../providers/data-service/data-service';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    HttpModule
  ],
  declarations: [LoginComponent],
  exports: [LoginComponent],
  providers: [AuthService, SessionService, DataServiceProvider]
})
export class LoginModule { }
