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

    try {
      let url = "https://api.mittwald.de" + path;
      for (const [param, value] of Object.entries(pathParams)) {
        url = url.replace(`{${param}}`, encodeURIComponent(value));
      }

      const queryString = new URLSearchParams(queryParams).toString();
      if (queryString) {
        url += `?${queryString}`;
      }

      const headers: HeadersInit = {
        Authorization: `Bearer ${apiKey}`,
      };

      if (requestBody) {
        headers["Content-Type"] = "application/json";
      }

      const res = await fetch(url, {
        method: method.toUpperCase(),
        headers,
        body: requestBody || undefined,
      });

      const contentType = res.headers.get("content-type") || "";
      const rawText = await res.text();

      if (contentType.includes("application/json")) {
        try {
          const json = JSON.parse(rawText);
          setResponseText(JSON.stringify(json, null, 2));
        } catch {
          setResponseText(rawText);
        }
      } else {
        setResponseText(rawText);
      }

      setRequestState(res.ok ? "success" : "error");
      setResponse(res);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Request failed";
      setResponseText(message);
      setRequestState("error");
      setResponse(null);
    }
  }, [path, method, apiKey, pathParams, queryParams, requestBody]);

  const updatePathParam = useCallback((name: string, value: string) => {
    setPathParams((prev) => ({ ...prev, [name]: value }));
  }, []);

  const updateQueryParam = useCallback((name: string, value: string) => {
    setQueryParams((prev) => {
      const next = { ...prev };
      if (value === "") {
        delete next[name];
      } else {
        next[name] = value;
      }
      return next;
    });
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
