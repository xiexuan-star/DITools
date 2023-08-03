import { Injectable } from './DI';

@Injectable()
export class Transportation {
  drive() {
    return 'transportation';
  }
}

@Injectable()
export class Student {
  constructor(private transportation: Transportation) {}

  gotoSchool() {
    return `go to school by ${ this.transportation.drive() }`;
  }
}
