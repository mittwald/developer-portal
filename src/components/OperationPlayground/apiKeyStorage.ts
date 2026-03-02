const API_KEY_STORAGE_KEY = "mstudio-api-key";
const USER_EMAIL_STORAGE_KEY = "mstudio-user-email";

export interface StoredApiKeyData {
  apiKey: string | null;
  userEmail: string | null;
}

/**
 * Check if localStorage is available (not during SSR).
 */
function isLocalStorageAvailable(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

/**
 * Load API key and user email from localStorage.
 */
export function loadApiKeyData(): StoredApiKeyData {
  if (!isLocalStorageAvailable()) {
    return { apiKey: null, userEmail: null };
  }
  return {
    apiKey: localStorage.getItem(API_KEY_STORAGE_KEY),
    userEmail: localStorage.getItem(USER_EMAIL_STORAGE_KEY),
  };
}

/**
 * Save API key and user email to localStorage.
 */
export function saveApiKeyData(apiKey: string, userEmail: string): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  localStorage.setItem(USER_EMAIL_STORAGE_KEY, userEmail);
}

/**
 * Remove API key and user email from localStorage.
 */
export function clearApiKeyData(): void {
  if (!isLocalStorageAvailable()) {
    return;
  }
  localStorage.removeItem(API_KEY_STORAGE_KEY);
  localStorage.removeItem(USER_EMAIL_STORAGE_KEY);
}

interface UserResponse {
  userId: string;
  email?: string;
  person?: {
    firstName?: string;
    lastName?: string;
  };
}

export interface VerifyApiKeyResult {
  success: boolean;
  email?: string;
  error?: string;
}

/**
 * Verify an API key by calling the user profile endpoint.
 * Returns the user's email on success, or an error message on failure.
 */
export async function verifyApiKey(apiKey: string): Promise<VerifyApiKeyResult> {
  try {
    const response = await fetch("https://api.mittwald.de/v2/users/self", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        return { success: false, error: "Invalid API key" };
      }
      return { success: false, error: `Verification failed: ${response.status}` };
    }

    const user: UserResponse = await response.json();
    return { success: true, email: user.email ?? "Unknown" };
  } catch {
    return { success: false, error: "Network error during verification" };
  }
}
