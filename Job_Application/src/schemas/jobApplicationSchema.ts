import { z } from 'zod';
import { checkEmailUniqueness } from '../utils/mockApi';

export const jobSchema = z.object({
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
}).refine(
  (data) => {
    if (!data.startDate || !data.endDate) return true;
    return new Date(data.endDate) > new Date(data.startDate);
  },
  {
    message: 'End date must be after start date',
    path: ['endDate'],
  }
);

export const jobApplicationSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Invalid email format')
    .superRefine(async (val, ctx) => {
      const isUnique = await checkEmailUniqueness(val);
      if (!isUnique) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'This email has already been used',
        });
      }
    }),
  jobs: z.array(jobSchema).min(1, 'At least one previous job is required'),
});

export type JobApplicationData = z.infer<typeof jobApplicationSchema>;
export type JobEntry = z.infer<typeof jobSchema>;
