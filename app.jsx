import React, { useState, useEffect } from 'react';
import ChatInterface from './components/ChatInterface';
import OnboardingForm from './components/OnboardingForm';
import { loadUserData, saveUserData } from './services/storageService';

export default function App() {
  const [userData, setUserData] = useState({
    income: 0,
    expenses: [],
    savingsGoal: 0
  });
  const [showOnboarding, setShowOnboarding] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    const data = await loadUserData();
    if (data && data.income > 0) {
      setUserData(data);
      setShowOnboarding(false);
    }
  };

  const completeOnboarding = async (income, goal) => {
    const newData = {
      ...userData,
      income: parseFloat(income),
      savingsGoal: parseFloat(goal)
    };
    setUserData(newData);
    await saveUserData(newData);
    setShowOnboarding(false);
  };

  const updateUserData = async (newData) => {
    setUserData(newData);
    await saveUserData(newData);
  };

  if (showOnboarding) {
    return <OnboardingForm onComplete={completeOnboarding} />;
  }

  return (
    <ChatInterface 
      userData={userData} 
      updateUserData={updateUserData}
    />
  );
}
