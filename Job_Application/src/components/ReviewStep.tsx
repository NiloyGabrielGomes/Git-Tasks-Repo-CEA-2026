import { useFormContext } from 'react-hook-form';
import type { JobApplicationData } from '../schemas/jobApplicationSchema';

interface ReviewStepProps {
  onBack: () => void;
}

export default function ReviewStep({ onBack }: ReviewStepProps) {
  const {
    watch,
    formState: { isSubmitting },
  } = useFormContext<JobApplicationData>();

  const data = watch();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-gray-900">Review & Submit</h2>

      <div className="bg-white border border-border rounded-lg p-6 space-y-6">
        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Personal Information
          </h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs font-medium text-muted uppercase tracking-wide">
                First Name
              </dt>
              <dd className="text-sm text-gray-900">{data.firstName}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium text-muted uppercase tracking-wide">
                Last Name
              </dt>
              <dd className="text-sm text-gray-900">{data.lastName}</dd>
            </div>
            <div className="md:col-span-2">
              <dt className="text-xs font-medium text-muted uppercase tracking-wide">
                Email
              </dt>
              <dd className="text-sm text-gray-900">{data.email}</dd>
            </div>
          </dl>
        </section>

        <hr className="border-border" />

        <section>
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Work Experience
          </h3>
          <div className="space-y-4">
            {data.jobs.map((job, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-md border border-border"
              >
                <p className="text-sm font-medium text-gray-900">
                  {job.role} at {job.company}
                </p>
                <p className="text-xs text-muted mt-1">
                  {job.startDate} to {job.endDate}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          className="btn-secondary"
          onClick={onBack}
          disabled={isSubmitting}
        >
          Back
        </button>
        <button
          type="submit"
          className="btn-primary"
          disabled={isSubmitting}
          aria-busy={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}
