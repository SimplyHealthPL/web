import { NgModule } from '@angular/core';
import {RouterModule} from '@angular/router';
import { LoginComponent } from './login.component';

// Utwórz moduł routingu projektu.
@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: 'login',
            component: LoginComponent,
        }
    ])
  ],
  exports: [RouterModule]
})
export class LoginRoutingModule {}
