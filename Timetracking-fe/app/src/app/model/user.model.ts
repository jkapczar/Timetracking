import {Creds} from './creds.model';

export class User {
  constructor(public id: number,
              public username: string,
              public firstName: string,
              public lastName: string,
              public email: string,
              public phone: string,
              public creds?: Creds
              ) {
  }
}
