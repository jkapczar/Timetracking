export class User {
  constructor(private username: string,
              private firstName?: string,
              private lastName?: string,
              private password?: string,
              private email?: string,
              private phone?: string,
              private secQuestion?: string,
              private secAnswer?: string) {
  }
}
