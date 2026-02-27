import {
  Action,
  ActionGroup,
  Button,
} from "@mittwald/flow-react-components";
import React from "react";
import { RequestState } from "./usePlaygroundRequest";

export interface PlaygroundActionsProps {
  /** Current state of the request */
  requestState: RequestState;
  /** Callback to execute the request */
  onExecute: () => void;
  /** Callback to reset the form */
  onReset: () => void;
}

/**
 * Action buttons for the playground: Execute, Reset, and Cancel.
 */
function PlaygroundActions({
  requestState,
  onExecute,
  onReset,
}: PlaygroundActionsProps) {
  return (
    <ActionGroup>
      <Action onAction={onExecute}>
        <Button
          isPending={requestState === "loading"}
          isSucceeded={requestState === "success"}
          isFailed={requestState === "error"}
          color="accent"
        >
          Execute request
        </Button>
      </Action>
      <Action onAction={onReset}>
        <Button variant="soft" color="secondary" slot="secondary">
          Reset
        </Button>
      </Action>
      <Action closeModal>
        <Button variant="soft" color="secondary" slot="secondary">
          Cancel
        </Button>
      </Action>
    </ActionGroup>
  );
}

export default PlaygroundActions;
