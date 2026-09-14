export interface EditorStep {
  key: string;
  title: string;
  description: string;
  index: number;
}

export const EDITOR_STEPS: EditorStep[] = [
  {
    key: "general-info",
    title: "General Info",
    description: "Resume Title & Overview",
    index: 0,
  },
  {
    key: "personal-info",
    title: "Personal Info",
    description: "Contact Info & Profile",
    index: 1,
  },
];

export const DEFAULT_STEP = "general-info";

export function isValidStep(stepKey: string): boolean {
  return EDITOR_STEPS.some((s) => s.key === stepKey);
}

export function getStepByIndex(index: number): EditorStep | undefined {
  return EDITOR_STEPS[index];
}

export function getNextStep(currentKey: string): string | null {
  const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentKey);
  if (currentIndex === -1 || currentIndex >= EDITOR_STEPS.length - 1) {
    return null;
  }
  return EDITOR_STEPS[currentIndex + 1].key;
}

export function getPrevStep(currentKey: string): string | null {
  const currentIndex = EDITOR_STEPS.findIndex((s) => s.key === currentKey);
  if (currentIndex <= 0) {
    return null;
  }
  return EDITOR_STEPS[currentIndex - 1].key;
}
