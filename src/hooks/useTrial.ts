// Simple trial hook for MKRO
export function useTrial() {
  return {
    isTrialExpired: false,
    isDevelopmentMode: true,
    isInTrial: true,
    daysLeft: 7,
    canUseFeature: (_feature: string) => true
  };
}