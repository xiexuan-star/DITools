import { Container } from '../DI';
import {
  Bicycle, Car, Father, ITransportation, Son, Student, StudentWithParamsInject, StudentWithPropertyInject,
  Transportation
} from '../index';

test('basic usage of DI', () => {
  const container = new Container();

  let week = 5;
  container.register({
    token: Transportation,
    useFactory: (c: ContainerInterface) => {
      if (week <= 5) {
        return c.resolve(Bicycle);
      } else {
        return c.resolve(Car);
      }
    }
  }, {
    token: ITransportation,
    useFactory: (c: ContainerInterface) => {
      if (week <= 5) {
        return c.resolve(Bicycle);
      } else {
        return c.resolve(Car);
      }
    }
  });

  const student = container.resolve(Student);
  expect(student.gotoSchool()).toBe('go to school by bicycle');

  const student2 = container.resolve(StudentWithParamsInject);
  expect(student2.gotoSchool()).toBe('go to school by bicycle');

  const student3 = container.resolve(StudentWithPropertyInject);
  expect(student3.gotoSchool()).toBe('go to school by bicycle');

  week = 6;

  const student4 = container.resolve(Student);
  expect(student4.gotoSchool()).toBe('go to school by car');

  const student5 = container.resolve(StudentWithParamsInject);
  expect(student5.gotoSchool()).toBe('go to school by car');

  const container2 = new Container();
  container2.register(Father, Son);
  const father = container2.resolve(Father);
  expect(father.getDescription()).toBe('I am Durotan, my son is Thrall.');
});
