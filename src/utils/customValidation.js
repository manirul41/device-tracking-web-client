export const REQUIRED = value => (value ? undefined : 'Required');

export const MAX_LENGTH = max => value => value && value.length > max ? `Must be ${max} characters or less` : undefined;
export const MAX_NUMBER_LENGTH = max => value => value && value.length > max ? `Number Must be ${max} digits or less` : undefined;
export const MIN_LENGTH = min => value => value && value.length < min ? `Must be ${min} characters or more` : undefined;
export const MIN_NUMBER_LENGTH = min => value => value && value.length < min ? `Number Must be ${min} digits or more` : undefined;

export const NUMBER = value => value && isNaN(Number(value)) ? 'Must be a number' : undefined;
export const MIN_VALUE = min => value => value && value < min ? `Must be at least ${min}` : undefined;
export const MAX_VALUE = max => value => value && value > max ? `Must be ${max} or less` : undefined;
