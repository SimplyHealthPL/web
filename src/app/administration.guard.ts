import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../providers/auth/auth.service';
import { Observable } from 'rxjs';

@Injectable()
export class AdministrationGuard implements CanActivate {

  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.auth.isSignedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
