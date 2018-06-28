import { Component, OnInit, OnDestroy } from '@angular/core';
import { DataServiceProvider } from '../../providers/data-service/data-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../providers/auth/auth.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public frm: FormGroup;
  public subscription;
  public isBusy = false;
  public hasFailed = false;
  public showInputErrors = false;

  constructor( private afAuth: AngularFireAuth,
    private auth: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private data: DataServiceProvider) {
    this.frm = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  public doSignIn() {

    // Make sure form values are valid
    if (this.frm.invalid) {
      this.showInputErrors = true;
      return;
    }

    // Reset status
    this.isBusy = true;
    this.hasFailed = false;

    // Grab values from form
    const username = this.frm.get('username').value;
    const password = this.frm.get('password').value;

    // Submit request to API
    this.login(username, password);
  }

  async login(username, password) {
    try {
      const result = await this.afAuth.auth.signInWithEmailAndPassword(username, password);
      if (result) {
        this.subscription = this.data.getUser(result.user.uid).subscribe(data => {
          if (data[0].roles.admin === true) {
            this.auth.doSignIn(
              data[0].email,
              data[0].roles.admin
            );
            this.router.navigate(['admin']);
          } else {
            this.isBusy = false;
            this.hasFailed = true;
          }
        });
      }
    } catch (e) {
      console.error(e);
      this.isBusy = false;
      this.hasFailed = true;
    //  this.response = e.message;
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
        this.subscription.unsubscribe();
    }
  }

}
