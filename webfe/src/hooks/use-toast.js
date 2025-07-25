import { useCallback } from 'react';

export function useToast() {
  // Simple toast implementation using window.alert for demo
  // Replace with your own toast library or UI as needed
  const toast = useCallback(({ title, description, variant }) => {
    let message = title;
    if (description) message += `: ${description}`;
    window.alert(message);
  }, []);

  return { toast };
}
