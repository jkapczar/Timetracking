export class User {
  constructor(private username: string,
              private password: string,
              private email: string,
              private secQuestion: string,
              private secAnswer: string) {
  }
}
