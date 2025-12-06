import { format as formatDate, parseISO } from 'date-fns';
import { capitalize, isEmpty, isNil, trim } from 'lodash-es';

export const formatters = {
  currency: (value: number | null | undefined, currency: string = 'USD'): string => {
    if (isNil(value)) return '-';

    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(value);
  },

  date: (date: string | Date | null | undefined, formatStr: string = 'MMM dd, yyyy'): string => {
    if (isNil(date) || isEmpty(date)) return '-';

    try {
      const dateObj = typeof date === 'string' ? parseISO(date) : date;
      return formatDate(dateObj, formatStr);
    } catch (error) {
      console.error('Date formatting error:', error);
      return '-';
    }
  },

  datetime: (date: string | Date | null | undefined): string => {
    return formatters.date(date, 'MMM dd, yyyy HH:mm');
  },

  fullName: (firstName: string | null | undefined, lastName: string | null | undefined): string => {
    const first = firstName ? capitalize(trim(firstName)) : '';
    const last = lastName ? capitalize(trim(lastName)) : '';

    if (isEmpty(first) && isEmpty(last)) return '-';

    return trim(`${first} ${last}`);
  },

  phone: (phone: string | null | undefined): string => {
    if (isNil(phone) || isEmpty(phone)) return '-';

    const cleaned = phone.replace(/\D/g, '');

    if (cleaned.length === 10) {
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
    }

    return phone;
  },

  number: (value: number | null | undefined, decimals: number = 0): string => {
    if (isNil(value)) return '-';

    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(value);
  },

  percentage: (value: number | null | undefined, decimals: number = 0): string => {
    if (isNil(value)) return '-';

    return `${formatters.number(value, decimals)}%`;
  },

  truncate: (text: string | null | undefined, maxLength: number = 50): string => {
    if (isNil(text) || isEmpty(text)) return '-';

    if (text.length <= maxLength) return text;

    return `${text.slice(0, maxLength)}...`;
  },
};
