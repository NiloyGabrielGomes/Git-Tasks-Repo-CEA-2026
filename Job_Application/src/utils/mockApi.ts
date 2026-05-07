const usedEmails = new Set<string>();

export async function checkEmailUniqueness(email: string): Promise<boolean> {
  await delay(500);
  return !usedEmails.has(email.toLowerCase().trim());
}

export function markEmailAsUsed(email: string): void {
  usedEmails.add(email.toLowerCase().trim());
}

export async function submitApplication(_data: unknown): Promise<void> {
  await delay(800);
  if (Math.random() < 0.4) {
    throw new Error('Submission failed. Please try again later.');
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
