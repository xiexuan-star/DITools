export const DESIGN_TYPE_NAME = {
  DesignType: 'design:type',
  ParamType: 'design:paramtypes',
  ReturnType: 'design:returntype'
};

export const DECORATOR_KEY = {
  Injectable: Symbol.for('Injectable'),
  InjectParameter: Symbol.for('InjectParameter'),
  InjectProperty: Symbol.for('InjectProperty'),
};

export const REFLECT_KEY = {
  Container: Symbol.for('Container'),
};

export const ERROR_MSG = {
  NO_INJECTABLE: 'Constructor should be wrapped with decorator Injectable.',
};
