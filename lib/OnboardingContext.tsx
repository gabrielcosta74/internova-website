import { createContext, useCallback, useContext, useState, type ReactNode } from 'react';

export type OnboardingIntent = 'start' | 'schedule';

interface OnboardingRequest {
  intent?: OnboardingIntent;
  plan?: string;
}

interface OnboardingState {
  isOpen: boolean;
  intent: OnboardingIntent;
  plan?: string;
}

interface OnboardingContextValue extends OnboardingState {
  openOnboarding: (request?: OnboardingRequest) => void;
  closeOnboarding: () => void;
}

const OnboardingContext = createContext<OnboardingContextValue | null>(null);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<OnboardingState>({
    isOpen: false,
    intent: 'start',
  });

  const openOnboarding = useCallback(({ intent = 'start', plan }: OnboardingRequest = {}) => {
    setState({ isOpen: true, intent, plan });
  }, []);

  const closeOnboarding = useCallback(() => {
    setState((current) => ({ ...current, isOpen: false }));
  }, []);

  return (
    <OnboardingContext.Provider value={{ ...state, openOnboarding, closeOnboarding }}>
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);

  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }

  return context;
}
