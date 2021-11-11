/* eslint-disable @typescript-eslint/no-empty-function */
import * as Validator from './validator';

test('Required', () => {
  const defaultErrorMessage = 'Required';
  const customErrorMessage = 'Field is required';
  const validate = Validator.Required();
  const validateMessage = Validator.Required(customErrorMessage);

  expect(validate(true)).toBe(true);
  expect(validate(false)).toBe(true);
  expect(validate(null)).toBe(defaultErrorMessage);
  expect(validate(undefined)).toBe(defaultErrorMessage);
  expect(validate([])).toBe(defaultErrorMessage);
  expect(validate({})).toBe(defaultErrorMessage);
  expect(validate('')).toBe(defaultErrorMessage);

  expect(validate(0)).toBe(true);
  expect(validate(-1)).toBe(true);
  expect(validate(-13.12)).toBe(true);
  expect(validate(12345667890)).toBe(true);
  expect(validate('foo')).toBe(true);
  expect(validate({ foo: 'bar' })).toBe(true);
  expect(validateMessage(null)).toBe(customErrorMessage);
});

test('MinLength', () => {
  const defaultErrorMessage = 'Minimum 3 characters';
  const customErrorMessage = 'At least 3 characters';
  const validate = Validator.MinLength(3);
  const validateMessage = Validator.MinLength(3, customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate('foo')).toBe(true);
  expect(validate('fo')).toBe(defaultErrorMessage);
  expect(validate(100)).toBe(defaultErrorMessage);
  expect(validate(10)).toBe(defaultErrorMessage);
  expect(validateMessage('fo')).toBe(customErrorMessage);
});

test('MaxLength', () => {
  const defaultErrorMessage = 'Maximum 2 characters';
  const customErrorMessage = 'Max 2 characters';
  const validate = Validator.MaxLength(2);
  const validateMessage = Validator.MaxLength(2, customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate('fo')).toBe(true);
  expect(validate('foo')).toBe(defaultErrorMessage);
  expect(validate(10)).toBe(defaultErrorMessage);
  expect(validate(100)).toBe(defaultErrorMessage);
  expect(validateMessage('foo')).toBe(customErrorMessage);
});

test('Numeric', () => {
  const defaultErrorMessage = 'Not valid number';
  const customErrorMessage = 'Should be a number';
  const validate = Validator.Numeric();
  const validateMessage = Validator.Numeric(customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate(10)).toBe(true);
  expect(validate(0)).toBe(true);
  expect(validate(1)).toBe(true);
  expect(validate(-1)).toBe(true);
  expect(validate(-13.12)).toBe(true);
  expect(validate(12345667890)).toBe(true);
  expect(validate('123')).toBe(true);
  expect(validate('123.234')).toBe(true);
  expect(validate('2e+2')).toBe(defaultErrorMessage);
  expect(validate('123f0')).toBe(defaultErrorMessage);
  expect(validate('bar')).toBe(defaultErrorMessage);
  expect(validateMessage('foo')).toBe(customErrorMessage);
});

test('IntegerNumber', () => {
  const defaultErrorMessage = 'Not valid integer number';
  const customErrorMessage = 'Should be an integer';
  const validate = Validator.IntegerNumber();
  const validateMessage = Validator.IntegerNumber(customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate(10)).toBe(true);
  expect(validate(0)).toBe(true);
  expect(validate(1)).toBe(true);
  expect(validate(-1)).toBe(true);
  expect(validate(-13.12)).toBe(defaultErrorMessage);
  expect(validate(12345667890)).toBe(true);
  expect(validate('123')).toBe(true);
  expect(validate('123.234')).toBe(defaultErrorMessage);
  expect(validate('2e+2')).toBe(defaultErrorMessage);
  expect(validate('123f0')).toBe(defaultErrorMessage);
  expect(validate('bar')).toBe(defaultErrorMessage);
  expect(validateMessage('foo')).toBe(customErrorMessage);
});

test('FloatNumber', () => {
  const defaultErrorMessage = 'Not valid float number';
  const customErrorMessage = 'Should be a float';
  const validate = Validator.FloatNumber();
  const validateMessage = Validator.FloatNumber(customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate(10)).toBe(defaultErrorMessage);
  expect(validate(0)).toBe(defaultErrorMessage);
  expect(validate(1)).toBe(defaultErrorMessage);
  expect(validate(-1)).toBe(defaultErrorMessage);
  expect(validate(-13.12)).toBe(true);
  expect(validate(12345667890)).toBe(defaultErrorMessage);
  expect(validate('123')).toBe(defaultErrorMessage);
  expect(validate('123.234')).toBe(true);
  expect(validate('2e+2')).toBe(defaultErrorMessage);
  expect(validate('123f0')).toBe(defaultErrorMessage);
  expect(validate('bar')).toBe(defaultErrorMessage);
  expect(validateMessage('foo')).toBe(customErrorMessage);
});

test('Min', () => {
  const defaultErrorMessage = 'Minimum -0.01';
  const customErrorMessage = 'Min -10';
  const validate = Validator.Min(-0.01);
  const validateMessage = Validator.Min(-10, customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate(-0.009)).toBe(true);
  expect(validate(-0.011)).toBe(defaultErrorMessage);
  expect(validate('-0.009')).toBe(true);
  expect(validate('-0.011')).toBe(defaultErrorMessage);
  expect(validateMessage(-11)).toBe(customErrorMessage);
});

test('Max', () => {
  const defaultErrorMessage = 'Maximum -0.01';
  const customErrorMessage = 'Max -10';
  const validate = Validator.Max(-0.01);
  const validateMessage = Validator.Max(-10, customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate(-0.009)).toBe(defaultErrorMessage);
  expect(validate(-0.011)).toBe(true);
  expect(validate('-0.009')).toBe(defaultErrorMessage);
  expect(validate('-0.011')).toBe(true);
  expect(validateMessage(-9)).toBe(customErrorMessage);
});

test('Email', () => {
  const defaultErrorMessage = 'Not valid email address';
  const customErrorMessage = 'Invalid email';
  const validate = Validator.Email();
  const validateMessage = Validator.Email(customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate('Test.Test@example.com')).toBe(true);
  expect(validate('Test.Test@example.c!m')).toBe(defaultErrorMessage);
  expect(validateMessage('Test.Test@example.c!m')).toBe(customErrorMessage);
});

test('Preg', () => {
  const defaultErrorMessage = 'Not valid';
  const customErrorMessage = 'At least 1 uppercase alphabetical character';
  const preg = /^(?=.*[A-Z]).+$/;
  const validate = Validator.Preg(preg);
  const validateMessage = Validator.Preg(preg, customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate('foo Bar')).toBe(true);
  expect(validate('foo bar')).toBe(defaultErrorMessage);
  expect(validateMessage('foo bar')).toBe(customErrorMessage);
});

test('Range', () => {
  const defaultErrorMessage = 'Not valid';
  const customErrorMessage = 'Invalid country';
  const range = ['US', 'CA'];
  const validate = Validator.Range(range);
  const validateMessage = Validator.Range(range, customErrorMessage);

  expect(validate(true)).toBe(defaultErrorMessage);
  expect(validate(false)).toBe(defaultErrorMessage);
  expect(validate(null)).toBe(true);
  expect(validate(undefined)).toBe(true);
  expect(validate([])).toBe(true);
  expect(validate({})).toBe(true);
  expect(validate('')).toBe(true);

  expect(validate('US')).toBe(true);
  expect(validate('us')).toBe(defaultErrorMessage);
  expect(validateMessage('ca')).toBe(customErrorMessage);
});
