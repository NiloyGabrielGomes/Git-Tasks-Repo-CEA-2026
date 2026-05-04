import { useFieldArray, useFormContext } from 'react-hook-form';
import type { JobApplicationData } from '../schemas/jobApplicationSchema';

interface ExperienceStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function ExperienceStep({ onNext, onBack }: ExperienceStepProps) {
  const {
    register,
    control,
    formState: { errors, isValidating },
    trigger,
    setFocus,
  } = useFormContext<JobApplicationData>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'jobs',
  });

  const handleNext = async () => {
    const valid = await trigger('jobs');
    if (!valid) {
      const jobErrors = errors.jobs;
      if (Array.isArray(jobErrors)) {
        for (let i = 0; i < jobErrors.length; i++) {
          const jobError = jobErrors[i];
          if (jobError) {
            const fieldOrder: Array<'company' | 'role' | 'startDate' | 'endDate'> = [
              'company',
              'role',
              'startDate',
              'endDate',
            ];
            for (const fieldName of fieldOrder) {
              if (jobError[fieldName]) {
                setFocus(`jobs.${i}.${fieldName}` as const);
                return;
              }
            }
          }
        }
      }
      return;
    }
    onNext();
  };

  const addJob = () => {
    append({ company: '', role: '', startDate: '', endDate: '' });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Work Experience</h2>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const jobError = errors.jobs?.[index];
          return (
            <div
              key={field.id}
              className="p-4 border border-gray-200 rounded-lg bg-white space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">
                  Job {index + 1}
                </h3>
                {fields.length > 1 && (
                  <button
                    type="button"
                    className="bg-red-100 text-red-600 hover:bg-red-200 text-xs px-2 py-1"
                    onClick={() => remove(index)}
                    aria-label={`Remove job ${index + 1}`}
                  >
                    Remove
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor={`jobs-${index}-company`}>Company</label>
                  <input
                    id={`jobs-${index}-company`}
                    type="text"
                    {...register(`jobs.${index}.company`)}
                    aria-invalid={jobError?.company ? 'true' : 'false'}
                    aria-describedby={
                      jobError?.company ? `jobs-${index}-company-error` : undefined
                    }
                  />
                  {jobError?.company && (
                    <p
                      id={`jobs-${index}-company-error`}
                      className="error-message"
                      role="alert"
                    >
                      {jobError.company.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`jobs-${index}-role`}>Role</label>
                  <input
                    id={`jobs-${index}-role`}
                    type="text"
                    {...register(`jobs.${index}.role`)}
                    aria-invalid={jobError?.role ? 'true' : 'false'}
                    aria-describedby={
                      jobError?.role ? `jobs-${index}-role-error` : undefined
                    }
                  />
                  {jobError?.role && (
                    <p
                      id={`jobs-${index}-role-error`}
                      className="error-message"
                      role="alert"
                    >
                      {jobError.role.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`jobs-${index}-startDate`}>Start Date</label>
                  <input
                    id={`jobs-${index}-startDate`}
                    type="date"
                    {...register(`jobs.${index}.startDate`)}
                    aria-invalid={jobError?.startDate ? 'true' : 'false'}
                    aria-describedby={
                      jobError?.startDate ? `jobs-${index}-startDate-error` : undefined
                    }
                  />
                  {jobError?.startDate && (
                    <p
                      id={`jobs-${index}-startDate-error`}
                      className="error-message"
                      role="alert"
                    >
                      {jobError.startDate.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor={`jobs-${index}-endDate`}>End Date</label>
                  <input
                    id={`jobs-${index}-endDate`}
                    type="date"
                    {...register(`jobs.${index}.endDate`)}
                    aria-invalid={jobError?.endDate ? 'true' : 'false'}
                    aria-describedby={
                      jobError?.endDate ? `jobs-${index}-endDate-error` : undefined
                    }
                  />
                  {jobError?.endDate && (
                    <p
                      id={`jobs-${index}-endDate-error`}
                      className="error-message"
                      role="alert"
                    >
                      {jobError.endDate.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full"
        onClick={addJob}
      >
        + Add Another Job
      </button>

      {errors.jobs?.root && (
        <p className="error-message" role="alert">
          {errors.jobs.root.message}
        </p>
      )}

      <div className="flex justify-between pt-4">
        <button type="button" className="bg-gray-200 text-gray-800 hover:bg-gray-300" onClick={onBack}>
          Back
        </button>
        <button
          type="button"
          className="bg-indigo-600 text-white hover:bg-indigo-700"
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
