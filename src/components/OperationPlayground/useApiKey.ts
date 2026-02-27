import { useCallback, useEffect, useState } from "react";

const API_KEY_STORAGE_KEY = "mstudio-api-key";
const USER_EMAIL_STORAGE_KEY = "mstudio-user-email";

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

interface UserResponse {
  userId: string;
  email?: string;
  person?: {
    firstName?: string;
    lastName?: string;
  };
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
    const storedKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    const storedEmail = localStorage.getItem(USER_EMAIL_STORAGE_KEY);
    if (storedKey) {
      setApiKey(storedKey);
    }
    if (storedEmail) {
      setUserEmail(storedEmail);
    }
  }, []);

  const saveApiKey = useCallback(async (key: string): Promise<boolean> => {
    setIsVerifying(true);
    setVerificationError(undefined);

    try {
      const response = await fetch("https://api.mittwald.de/v2/users/self", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${key}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setVerificationError("Invalid API key");
        } else {
          setVerificationError(`Verification failed: ${response.status}`);
        }
        setIsVerifying(false);
        return false;
      }

      const user: UserResponse = await response.json();
      const email = user.email ?? "Unknown";

      localStorage.setItem(API_KEY_STORAGE_KEY, key);
      localStorage.setItem(USER_EMAIL_STORAGE_KEY, email);

      setApiKey(key);
      setUserEmail(email);
      setIsVerifying(false);
      return true;
    } catch (error) {
      setVerificationError("Network error during verification");
      setIsVerifying(false);
      return false;
    }
  }, []);

  const clearApiKey = useCallback(() => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
    setApiKey(undefined);
    setUserEmail(undefined);
    setVerificationError(undefined);
  }, []);

  return {
    apiKey,
    userEmail,
    isVerifying,
    verificationError,
    saveApiKey,
    clearApiKey,
  };
}
