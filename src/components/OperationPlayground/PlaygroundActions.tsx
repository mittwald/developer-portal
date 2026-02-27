import {
  Action,
  ActionGroup,
  Button,
} from "@mittwald/flow-react-components";
import Translate from "@docusaurus/Translate";
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
          <Translate id="playground.actions.execute">Execute request</Translate>
        </Button>
      </Action>
      <Action onAction={onReset}>
        <Button variant="soft" color="secondary" slot="secondary">
          <Translate id="playground.actions.reset">Reset</Translate>
        </Button>
      </Action>
      <Action closeModal>
        <Button variant="soft" color="secondary" slot="secondary">
          <Translate id="playground.actions.cancel">Cancel</Translate>
        </Button>
      </Action>
    </ActionGroup>
  );
}

export default PlaygroundActions;
