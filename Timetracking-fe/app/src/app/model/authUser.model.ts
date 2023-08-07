export class AuthUser {
  constructor(public username: string,
              public roles: string[],
              public iat: number,
              public exp: number,
              public token: string) {
  }
}
