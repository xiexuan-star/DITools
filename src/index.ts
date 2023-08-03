import { Injectable } from './DI';

export class Transportation {
  drive() {
    return 'transportation';
  }
}

@Injectable()
export class Bicycle extends Transportation {
  drive() {
    return 'bicycle';
  }
}

@Injectable()
export class Car extends Transportation {
  drive() {
    return 'car';
  }
}

@Injectable()
export class Student {
  constructor(private transportation: Transportation) {}

  gotoSchool() {
    return `go to school by ${ this.transportation.drive() }`;
  }
}
