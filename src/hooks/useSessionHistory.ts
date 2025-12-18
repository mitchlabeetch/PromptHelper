import { useState, useEffect } from 'react';
import { LaunchPlan } from '@/types';

const STORAGE_KEY = 'prompthelper_history';

interface HistoryItem {
  id: string;
  timestamp: number;
  plan: LaunchPlan;
  userRequest: string;
}

export function useSessionHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
        setIsMounted(true);
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          try {
            setHistory(JSON.parse(stored));
          } catch (e) {
            console.error("Failed to parse history", e);
          }
        }
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  const saveToHistory = (plan: LaunchPlan, userRequest: string) => {
    if (!isMounted) return;

    const newItem: HistoryItem = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      plan,
      userRequest
    };

    const updated = [newItem, ...history].slice(0, 10);
    setHistory(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  return { history, saveToHistory, clearHistory, isMounted };
}
