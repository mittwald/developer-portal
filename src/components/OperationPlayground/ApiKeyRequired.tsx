import {
  Action,
  ActionGroup,
  Button,
  Content,
  Heading,
  IllustratedMessage,
  Modal,
  ModalProps,
  Text,
} from "@mittwald/flow-react-components";
import { IconKey } from "@tabler/icons-react";
import React from "react";
import ApiKeyForm from "./ApiKeyForm";

export interface ApiKeyRequiredProps {
  /** Whether API key verification is in progress */
  isVerifying: boolean;
  /** Error message from verification */
  error: string | undefined;
  /** Callback when user submits the API key */
  onSubmit: (apiKey: string) => Promise<boolean>;
}

/**
 * Displays an illustrated message prompting the user to configure an API key.
 * Includes a button that opens the API key configuration form.
 */
function ApiKeyRequired({
  isVerifying,
  error,
  onSubmit,
  ...modalProps
}: ApiKeyRequiredProps & ModalProps) {
  return (
    <Modal {...modalProps}>
      <Heading>API Playground</Heading>
      <Content>
        <IllustratedMessage>
          <IconKey />
          <Heading>API Key Required</Heading>
          <Text>
            To use the API Playground, you need to configure your mStudio API
            key first. Your API key will be stored in your browser's local
            storage.
          </Text>
          <ApiKeyForm
            isVerifying={isVerifying}
            error={error}
            onSubmit={onSubmit}
          >
            <Button color="accent">Add API Key</Button>
          </ApiKeyForm>
        </IllustratedMessage>
      </Content>

      <ActionGroup>
        <Action closeModal>
          <Button variant="soft" color="secondary">
            Cancel
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  );
}

export default ApiKeyRequired;
