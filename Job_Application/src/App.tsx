import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import type { FieldPath, FieldErrors } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Toaster, toast } from 'sonner';
import {
  jobApplicationSchema,
} from './schemas/jobApplicationSchema';
import type { JobApplicationData } from './schemas/jobApplicationSchema';
import { submitApplication, markEmailAsUsed } from './utils/mockApi';
import PersonalInfoStep from './components/PersonalInfoStep';
import ExperienceStep from './components/ExperienceStep';
import ReviewStep from './components/ReviewStep';

function StepIndicator({ currentStep }: { currentStep: number }) {
  const steps = ['Personal Info', 'Experience', 'Review & Submit'];
  return (
    <nav aria-label="Form progress" className="mb-8">
      <ol className="flex items-center justify-between">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <li key={label} className="flex-1 flex items-center">
              <div className="flex flex-col items-center w-full">
                <span
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium border-2 ${
                    isActive
                      ? 'border-primary bg-primary text-white'
                      : isCompleted
                      ? 'border-success bg-success text-white'
                      : 'border-gray-300 bg-white text-gray-500'
                  }`}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? '✓' : stepNumber}
                </span>
                <span
                  className={`mt-2 text-xs font-medium ${
                    isActive
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-success'
                      : 'text-gray-500'
                  }`}
                >
                  {label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 ${
                    isCompleted ? 'bg-success' : 'bg-gray-200'
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

function App() {
  const [step, setStep] = useState(1);

  const methods = useForm<JobApplicationData>({
    resolver: zodResolver(jobApplicationSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      jobs: [{ company: '', role: '', startDate: '', endDate: '' }],
    },
  });

  const { handleSubmit, setFocus } = methods;

  const onSubmit = async (data: JobApplicationData) => {
    try {
      await submitApplication(data);
      markEmailAsUsed(data.email);
      toast.success('Application submitted successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Submission failed. Please try again.'
      );
    }
  };

  const onInvalid = (errors: FieldErrors<JobApplicationData>) => {
    const firstErrorField = Object.keys(errors)[0] as FieldPath<JobApplicationData> | undefined;
    if (firstErrorField) {
      setFocus(firstErrorField);
    }
  };

  return (
    <>
      <Toaster position="top-right" richColors />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Job Application
          </h1>
          <p className="text-center text-muted mb-8">
            Complete the form below to apply for the position.
          </p>

          <StepIndicator currentStep={step} />

          <div className="bg-white border border-border rounded-xl p-6 md:p-8 shadow-sm">
            <FormProvider {...methods}>
              <form onSubmit={handleSubmit(onSubmit, onInvalid)} noValidate>
                {step === 1 && (
                  <PersonalInfoStep onNext={() => setStep(2)} />
                )}
                {step === 2 && (
                  <ExperienceStep
                    onNext={() => setStep(3)}
                    onBack={() => setStep(1)}
                  />
                )}
                {step === 3 && <ReviewStep onBack={() => setStep(2)} />}
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
