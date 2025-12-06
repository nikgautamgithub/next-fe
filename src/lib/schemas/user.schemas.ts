import { UserRole } from '@/types/api';
import { z } from 'zod';

/**
 * Create User Form Schema
 */
export const createUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)'),
  firstName: z.string().min(1, 'First name is required').trim(),
  lastName: z.string().min(1, 'Last name is required').trim(),
  role: z.nativeEnum(UserRole).refine((val) => Object.values(UserRole).includes(val), {
    message: 'Please select a valid role',
  }),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

/**
 * Update User Form Schema
 */
export const updateUserSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .toLowerCase()
    .trim()
    .optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[!@#$%^&*]/, 'Password must contain at least one special character (!@#$%^&*)')
    .optional()
    .or(z.literal('')),
  firstName: z.string().min(1, 'First name is required').trim().optional(),
  lastName: z.string().min(1, 'Last name is required').trim().optional(),
  role: z.nativeEnum(UserRole).optional(),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;

/**
 * User Filter Schema (for search/filter forms)
 */
export const userFilterSchema = z.object({
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  page: z.number().int().positive().optional(),
  limit: z.number().int().positive().max(100).optional(),
});

export type UserFilterFormData = z.infer<typeof userFilterSchema>;
