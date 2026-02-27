import { useCallback, useEffect, useState } from "react";
import {
  clearApiKeyData,
  loadApiKeyData,
  saveApiKeyData,
  verifyApiKey,
} from "./apiKeyStorage";

export interface ApiKeyState {
  /** The stored API key, or undefined if not set */
  apiKey: string | undefined;
  /** The verified user's email address */
  userEmail: string | undefined;
  /** Whether the API key is currently being verified */
  isVerifying: boolean;
  /** Error message if verification failed */
  verificationError: string | undefined;
}

export interface UseApiKeyResult extends ApiKeyState {
  /** Save and verify a new API key */
  saveApiKey: (key: string) => Promise<boolean>;
  /** Clear the stored API key and user email */
  clearApiKey: () => void;
}

/**
 * Hook for managing mStudio API key storage and verification.
 * Persists the API key and user email in localStorage.
 */
export function useApiKey(): UseApiKeyResult {
  const [apiKey, setApiKey] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationError, setVerificationError] = useState<
    string | undefined
  >(undefined);

  useEffect(() => {
    const { apiKey: storedKey, userEmail: storedEmail } = loadApiKeyData();
    if (storedKey) {
      setApiKey(storedKey);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const handleSaveApiKey = useCallback(
    async (key: string): Promise<boolean> => {
      setIsVerifying(true);
      setVerificationError(undefined);

      const result = await verifyApiKey(key);

      if (!result.success) {
        setVerificationError(result.error);
        setIsVerifying(false);
        return false;
      }

      saveApiKeyData(key, result.email);
      setApiKey(key);
      setUserEmail(result.email);
      setIsVerifying(false);
      return true;
    },
    [],
  );

  const handleClearApiKey = useCallback(() => {
    clearApiKeyData();
    setApiKey(undefined);
    setUserEmail(undefined);
    setVerificationError(undefined);
  }, []);

  return {
    apiKey,
    userEmail,
    isVerifying,
    verificationError,
    saveApiKey: handleSaveApiKey,
    clearApiKey: handleClearApiKey,
  };
}
