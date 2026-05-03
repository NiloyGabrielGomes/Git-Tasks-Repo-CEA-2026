import { useFormContext } from 'react-hook-form';
import type { JobApplicationData } from '../schemas/jobApplicationSchema';

interface PersonalInfoStepProps {
  onNext: () => void;
}

export default function PersonalInfoStep({ onNext }: PersonalInfoStepProps) {
  const {
    register,
    formState: { errors, isValidating },
    trigger,
    setFocus,
  } = useFormContext<JobApplicationData>();

  const handleNext = async () => {
    const valid = await trigger(['firstName', 'lastName', 'email']);
    if (!valid) {
      const errorFields = Object.keys(errors) as Array<keyof JobApplicationData>;
      const firstError = errorFields[0];
      if (firstError) {
        setFocus(firstError);
      }
      return;
    }
    onNext();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Personal Information</h2>

      <div>
        <label htmlFor="firstName">First Name</label>
        <input
          id="firstName"
          type="text"
          autoComplete="given-name"
          {...register('firstName')}
          aria-invalid={errors.firstName ? 'true' : 'false'}
          aria-describedby={errors.firstName ? 'firstName-error' : undefined}
        />
        {errors.firstName && (
          <p id="firstName-error" className="error-message" role="alert">
            {errors.firstName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="lastName">Last Name</label>
        <input
          id="lastName"
          type="text"
          autoComplete="family-name"
          {...register('lastName')}
          aria-invalid={errors.lastName ? 'true' : 'false'}
          aria-describedby={errors.lastName ? 'lastName-error' : undefined}
        />
        {errors.lastName && (
          <p id="lastName-error" className="error-message" role="alert">
            {errors.lastName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email">Email Address</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          {...register('email')}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={
            errors.email
              ? 'email-error'
              : isValidating
              ? 'email-validating'
              : undefined
          }
        />
        {isValidating && (
          <p id="email-validating" className="text-xs text-muted mt-1">
            Checking email availability...
          </p>
        )}
        {errors.email && (
          <p id="email-error" className="error-message" role="alert">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="button"
          className="btn-primary"
          onClick={handleNext}
          disabled={isValidating}
          aria-busy={isValidating}
        >
          {isValidating ? 'Validating...' : 'Next'}
        </button>
      </div>
    </div>
  );
}
