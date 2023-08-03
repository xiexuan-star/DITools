import { Inject, Injectable } from './DI';

export abstract class Transportation {
  abstract drive(): string
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

export const ITransportation = Symbol('ITransportation');

export interface ITransportation {
  drive(): string;
}

@Injectable()
export class Student {
  constructor(protected transportation: Transportation) {}

  gotoSchool() {
    return `go to school by ${ this.transportation.drive() }`;
  }
}

@Injectable()
export class StudentWithParamsInject extends Student {
  constructor(@Inject(ITransportation) transportation: ITransportation) {
    super(transportation);
  }
}

@Injectable()
export class StudentWithPropertyInject {
  @Inject(ITransportation)
  //@ts-ignore
  private transportation: ITransportation;

  gotoSchool() {
    return `go to school by ${ this.transportation!.drive() }`;
  }
}
