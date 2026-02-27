import { useCallback, useState } from "react";

export type RequestState = "idle" | "loading" | "success" | "error";

export interface PlaygroundRequestState {
  /** Current path parameter values */
  pathParams: Record<string, string>;
  /** Current query parameter values */
  queryParams: Record<string, string>;
  /** Current request body content */
  requestBody: string | undefined;
  /** Current state of the request */
  requestState: RequestState;
  /** The response object if request completed */
  response: Response | null;
  /** Formatted response text */
  responseText: string;
}

export interface UsePlaygroundRequestResult extends PlaygroundRequestState {
  /** Update a path parameter value */
  updatePathParam: (name: string, value: string) => void;
  /** Update a query parameter value */
  updateQueryParam: (name: string, value: string) => void;
  /** Set the request body content */
  setRequestBody: (body: string) => void;
  /** Execute the API request */
  executeRequest: () => Promise<void>;
  /** Reset the form to initial state */
  reset: () => void;
}

export interface UsePlaygroundRequestOptions {
  /** The API endpoint path */
  path: string;
  /** The HTTP method */
  method: string;
  /** The API key for authorization */
  apiKey: string;
}

/**
 * Hook for managing playground request state and execution.
 * Handles path/query parameters, request body, and response.
 */
export function usePlaygroundRequest({
  path,
  method,
  apiKey,
}: UsePlaygroundRequestOptions): UsePlaygroundRequestResult {
  const [pathParams, setPathParams] = useState<Record<string, string>>({});
  const [queryParams, setQueryParams] = useState<Record<string, string>>({});
  const [requestBody, setRequestBody] = useState<string | undefined>(undefined);
  const [requestState, setRequestState] = useState<RequestState>("idle");
  const [response, setResponse] = useState<Response | null>(null);
  const [responseText, setResponseText] = useState<string>("");

  const reset = useCallback(() => {
    setPathParams({});
    setQueryParams({});
    setRequestBody(undefined);
    setRequestState("idle");
    setResponse(null);
    setResponseText("");
  }, []);

  const executeRequest = useCallback(async () => {
    setRequestState("loading");

    let url = "https://api.mittwald.de" + path;
    for (const [param, value] of Object.entries(pathParams)) {
      url = url.replace(`{${param}}`, value);
    }

    const queryString = new URLSearchParams(queryParams).toString();
    if (queryString) {
      url += `?${queryString}`;
    }

    const res = await fetch(url, {
      method: method.toUpperCase(),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: requestBody,
    });

    const json = await res.json();
    setResponseText(JSON.stringify(json, null, 2));
    setRequestState(res.ok ? "success" : "error");
    setResponse(res);
  }, [path, method, apiKey, pathParams, queryParams, requestBody]);

  const updatePathParam = useCallback((name: string, value: string) => {
    setPathParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const updateQueryParam = useCallback((name: string, value: string) => {
    setQueryParams((prev) => ({
      ...prev,
      [name]: value === "" ? undefined : value,
    }));
  }, []);

  return {
    pathParams,
    queryParams,
    requestBody,
    requestState,
    response,
    responseText,
    updatePathParam,
    updateQueryParam,
    setRequestBody,
    executeRequest,
    reset,
  };
}
