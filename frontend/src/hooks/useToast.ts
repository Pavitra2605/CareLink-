import { useUIStore } from '@/app/stores/ui.store';
import { useCallback } from 'react';

export const useToast = () => {
  const { addToast } = useUIStore();

  return {
    success: useCallback(
      (message: string, duration?: number) =>
        addToast('success', message, duration),
      [addToast]
    ),
    error: useCallback(
      (message: string, duration?: number) =>
        addToast('error', message, duration),
      [addToast]
    ),
    warning: useCallback(
      (message: string, duration?: number) =>
        addToast('warning', message, duration),
      [addToast]
    ),
    info: useCallback(
      (message: string, duration?: number) =>
        addToast('info', message, duration),
      [addToast]
    ),
  };
};
