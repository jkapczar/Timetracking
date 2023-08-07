export class Group {
 constructor(public id: number,
             public name: string,
             public teamLeader: {username: string},
             public members: {username: string}[],
             public deputies: {username: string}[]) {
 }
}
