import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
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
  getUser(email): Observable<any> {
    return  this.afDB.list('users', ref => ref.orderByChild('email').equalTo(email)).valueChanges();
  }
  getUsers(): Observable<any> {
    return  this.afDB.list('users').valueChanges();
  }
  getContact(): Observable<any> {
    return  this.afDB.list('contacts').valueChanges();
  }
  getHotel(hotelId): Observable<any> {
    return this.afDB.list('hotels', ref => ref.orderByChild('id').equalTo(hotelId)).valueChanges();
  }
  getHappenings(eventId): Observable<any> {
      return this.afDB.list('happenings/' + eventId + '/days', ref => ref.orderByChild('date')).valueChanges();
  }
  getTravel(): Observable<any> {
    return this.afDB.list('travels').valueChanges();
  }
  getEvent(): Observable<any> {
    return this.afDB.object('event').valueChanges();
  }

}
