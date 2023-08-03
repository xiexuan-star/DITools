import { Container } from '../DI';
import { Bicycle, Car, Student, Transportation } from '../index';

test('basic usage of DI', () => {
  const container = new Container();

  let week = 5;
  container.register({
    token: Transportation, useFactory: (c: ContainerInterface) => {
      if (week <= 5) {
        return c.resolve(Bicycle);
      } else {
        return c.resolve(Car);
      }
    }
  });

  const student = container.resolve(Student);
  expect(student.gotoSchool()).toBe('go to school by bicycle');

  week = 6;

  const student2 = container.resolve(Student);
  expect(student2.gotoSchool()).toBe('go to school by car');
})
;

