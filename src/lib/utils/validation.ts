import { isEmpty, isNil } from 'lodash-es';

export const validators = {
  required: (value: unknown): boolean => {
    return !isNil(value) && !isEmpty(value);
  },

  email: (email: string): boolean => {
    if (isEmpty(email) || isNil(email)) return false;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  minLength: (value: string, min: number): boolean => {
    if (isNil(value)) return false;
    return value.length >= min;
  },

  maxLength: (value: string, max: number): boolean => {
    if (isNil(value)) return true;
    return value.length <= max;
  },

  password: (password: string): { valid: boolean; errors: string[] } => {
    const errors: string[] = [];

    if (isEmpty(password) || isNil(password)) {
      errors.push('Password is required');
      return { valid: false, errors };
    }

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (!/[!@#$%^&*]/.test(password)) {
      errors.push('Password must contain at least one special character (!@#$%^&*)');
    }

    return { valid: errors.length === 0, errors };
  },

  phone: (phone: string): boolean => {
    if (isEmpty(phone) || isNil(phone)) return false;

    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    return phoneRegex.test(phone);
  },

  url: (url: string): boolean => {
    if (isEmpty(url) || isNil(url)) return false;

    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },
};
