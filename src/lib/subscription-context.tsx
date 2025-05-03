'use client';

import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export type SubscriptionPlan = 'free' | 'premium';

interface SubscriptionContextType {
  plan: SubscriptionPlan;
  setPlan: (plan: SubscriptionPlan) => void;
  isSubscribed: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<SubscriptionPlan>('free');
  
  // Check local storage for saved subscription status on mount
  useEffect(() => {
    const savedPlan = localStorage.getItem('subscriptionPlan') as SubscriptionPlan;
    if (savedPlan) {
      setPlan(savedPlan);
    }
  }, []);
  
  // Save subscription status to local storage when it changes
  useEffect(() => {
    localStorage.setItem('subscriptionPlan', plan);
  }, [plan]);
  
  const isSubscribed = plan === 'premium';
  
  return (
    <SubscriptionContext.Provider 
      value={{ 
        plan, 
        setPlan, 
        isSubscribed 
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  
  return context;
};