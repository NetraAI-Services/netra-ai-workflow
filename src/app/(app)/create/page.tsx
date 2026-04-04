'use client';
import { useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useContentStore } from '@/store/useContentStore';
import { PageTransition } from '@/components/shared/animations';
import { StepIndicator } from './_components/StepIndicator';
import { Step0Platforms } from './_components/Step0Platforms';
import { Step1Prompt } from './_components/Step1Prompt';
import { Step2Generate } from './_components/Step2Generate';
import { Step3Edit } from './_components/Step3Edit';
import { Step4Preview } from './_components/Step4Preview';
import { Step5Schedule } from './_components/Step5Schedule';

const STEPS = ['Platforms', 'Prompt', 'Generate', 'Edit', 'Preview', 'Schedule'];

const stepComponents = [Step0Platforms, Step1Prompt, Step2Generate, Step3Edit, Step4Preview, Step5Schedule];

export default function CreatePage() {
  const { wizardStep, clearCurrentDraft } = useContentStore();
  const prevStep = useRef(wizardStep);
  const direction = wizardStep >= prevStep.current ? 1 : -1;

  useEffect(() => {
    prevStep.current = wizardStep;
  }, [wizardStep]);

  useEffect(() => {
    clearCurrentDraft();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const StepComponent = stepComponents[wizardStep];

  return (
    <PageTransition className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-page-title text-foreground">Create Post</h1>
        <p className="text-body-sm text-muted-foreground mt-1">
          AI-powered content generation for all your social platforms.
        </p>
      </div>

      <StepIndicator steps={STEPS} current={wizardStep} />

      <div className="min-h-[400px] overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={wizardStep}
            custom={direction}
            initial={{ opacity: 0, x: direction * 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction * -40 }}
            transition={{ duration: 0.3, ease: [0.32, 0.72, 0, 1] }}
          >
            <StepComponent />
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  );
}
