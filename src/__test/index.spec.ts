import { Container } from '../DI';
import { Student } from '../index';

test('basic usage of DI', () => {
  const container = new Container();

  const student = container.resolve(Student);

  expect(student.gotoSchool()).toBe('go to school by transportation')
});

