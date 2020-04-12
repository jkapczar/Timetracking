export class Creds {
  constructor(public id: number,
              public password: string,
              public secQuestion: string,
              public secAnswer: string,
              public active: boolean,
              public admin: boolean) {
  }
}
