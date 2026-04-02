'use client';
import { useEffect } from 'react';
import { useContentStore } from '@/store/useContentStore';
import { StepIndicator } from './_components/StepIndicator';
import { Step0Platforms } from './_components/Step0Platforms';
import { Step1Prompt } from './_components/Step1Prompt';
import { Step2Generate } from './_components/Step2Generate';
import { Step3Edit } from './_components/Step3Edit';
import { Step4Preview } from './_components/Step4Preview';
import { Step5Schedule } from './_components/Step5Schedule';

const STEPS = ['Platforms', 'Prompt', 'Generate', 'Edit', 'Preview', 'Schedule'];

export default function CreatePage() {
  const { wizardStep, clearCurrentDraft } = useContentStore();

  useEffect(() => {
    clearCurrentDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="max-w-3xl mx-auto space-y-6 netra-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Create Post</h1>
        <p className="text-muted-foreground text-sm mt-1">
          AI-powered content generation for all your social platforms.
        </p>
      </div>

      <StepIndicator steps={STEPS} current={wizardStep} />

      <div className="min-h-[400px]">
        {wizardStep === 0 && <Step0Platforms />}
        {wizardStep === 1 && <Step1Prompt />}
        {wizardStep === 2 && <Step2Generate />}
        {wizardStep === 3 && <Step3Edit />}
        {wizardStep === 4 && <Step4Preview />}
        {wizardStep === 5 && <Step5Schedule />}
      </div>
    </div>
  );
}
