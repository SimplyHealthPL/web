import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { User } from '../../shared/user';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AngularFireAuth } from 'angularfire2/auth';

import * as firebase from 'firebase/app';
import 'firebase/functions';
import { Diet } from '../../shared/diet';
import { Dish } from '../../shared/dish';
import { Element } from '../../shared/element';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {

  data: any;
  constructor(private afDB: AngularFireDatabase, private http: Http, private afAuth: AngularFireAuth) {
  }

  // Diets API

  getDiets(): Observable<any> {
    return this.afDB.list('diets').snapshotChanges();
  }

  // getDiet(dietId): Observable<any> {
    // return  this.afDB.list('diets', ref => ref.orderByChild('id').equalTo(dietId)).valueChanges();
  // }

  addDiet(diet: Diet): PromiseLike<any> {
    return this.afDB.list('diets').push(diet).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  updateDiet(diet: Diet, key: string): PromiseLike<any> {
    return this.afDB.list('diets').update(key, diet).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  deleteDiet(key: string): PromiseLike<any> {
    return this.afDB.list('diets').remove(key).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  // Users API

  getUsers(): Observable<any> {
    return  this.afDB.list('users').snapshotChanges();
  }

  getUser(userId): Observable<any> {
    return  this.afDB.list('users', ref => ref.orderByChild('id').equalTo(userId)).valueChanges();
  }

  getUserByKey(key: string): Observable<any> {
    return this.afDB.object('users/' + key).valueChanges();
  }

  addUser(user: User): Promise<any> {

    const addUser = firebase.functions().httpsCallable('addUser');

    return addUser({email: user.email})
      .then(res => this.addToBase(res.data.uid, user))
      .then(() => this.sendEmail(user.email))
      .then(() => {
        return true;
      })
      .catch(e => {
        return e;
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

  deleteUser(key: string, id: string): PromiseLike<any> {
    const deleteUser = firebase.functions().httpsCallable('deleteUser');

    return deleteUser({uid: id})
      .then(() => this.deleteFromBase(key))
      .then(() => {
        return true;
      })
      .catch(e => {
        return e;
      });
  }

  // Dishs API

  getDishs(): Observable<any> {
    return this.afDB.list('dishs').snapshotChanges();
  }

  // getDish(dishId): Observable<any> {
    // return  this.afDB.list('dishs', ref => ref.orderByChild('id').equalTo(dishId)).valueChanges();
  // }

  addDish(dish: Dish): PromiseLike<any> {
    return this.afDB.list('dishs').push(dish).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  updateDish(dish: Dish, key: string): PromiseLike<any> {
    return this.afDB.list('dishs').update(key, dish).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  deleteDish(key: string): PromiseLike<any> {
    return this.afDB.list('dishs').remove(key).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  // Elements API

  getElement(elementID): Observable<any> {
    return this.afDB.object('elements/' + elementID).valueChanges();
  }

  getElements(): Observable<any> {
    return this.afDB.list('elements').snapshotChanges();
  }

  // getElement(elementId): Observable<any> {
    // return  this.afDB.list('elements', ref => ref.orderByChild('id').equalTo(elementId)).valueChanges();
  // }

  addElement(element: Element): PromiseLike<any> {
    return this.afDB.list('elements').push(element).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  updateElement(element: Element, key: string): PromiseLike<any> {
    return this.afDB.list('elements').update(key, element).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  deleteElement(key: string): PromiseLike<any> {
    return this.afDB.list('elements').remove(key).then(() => {
      return true;
    }, (e) => {
      console.log(e);
      return false;
    });
  }

  // Unit API

  getUnit(unitID): Observable<any> {
    return this.afDB.object('units/' + unitID).valueChanges();
  }

  // Helper

  sendEmail(email) {
    this.afAuth.auth.sendPasswordResetEmail(email);
  }

  addToBase(uid, user) {
    user.id = uid;
    this.afDB.list('users').push(user);
  }

  deleteFromBase(key) {
    this.afDB.list('users').remove(key);
  }


}
