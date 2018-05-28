import { Injectable } from '@angular/core';

@Injectable()
export class SessionService {

  public accessToken: string;
  public auth: boolean;

  constructor() {}

  public destroy(): void {
    this.accessToken = null;
    this.auth = false;
  }
}
