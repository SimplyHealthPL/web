import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { User } from '../../shared/user';
/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  data: any;
  constructor(private afDB: AngularFireDatabase) {
  }

  getGala(galaId): Observable<any> {
    return  this.afDB.list('galas', ref => ref.orderByChild('id').equalTo(galaId)).valueChanges();
  }
  getDiets(): Observable<any> {
    return this.afDB.list('diets').snapshotChanges();
  }

  // Users API

  getUsers(): Observable<any> {
    return  this.afDB.list('users').snapshotChanges();
  }

  getUser(userId): Observable<any> {
    return  this.afDB.list('users', ref => ref.orderByChild('id').equalTo(userId)).valueChanges();
  }

  addUser(user: User): PromiseLike<any> {
    return this.afDB.list('users').push(user).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  updateUser(user: User, key: string): PromiseLike<any> {
    return this.afDB.list('users').update(key, user).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  deleteUser(key: string): PromiseLike<any> {
    return this.afDB.list('users').remove(key).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }


}
