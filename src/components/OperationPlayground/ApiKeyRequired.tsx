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
import Translate from "@docusaurus/Translate";
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
      <Heading>
        <Translate id="playground.title">API Playground</Translate>
      </Heading>
      <Content>
        <IllustratedMessage>
          <IconKey />
          <Heading>
            <Translate id="playground.apikey.required.title">
              API Key Required
            </Translate>
          </Heading>
          <Text>
            <Translate id="playground.apikey.required.description">
              To use the API Playground, you need to configure your mStudio API
              key first. Your API key will be stored in your browser's local
              storage.
            </Translate>
          </Text>
          <ApiKeyForm
            isVerifying={isVerifying}
            error={error}
            onSubmit={onSubmit}
          >
            <Button color="accent">
              <Translate id="playground.apikey.add">Add API Key</Translate>
            </Button>
          </ApiKeyForm>
        </IllustratedMessage>
      </Content>

      <ActionGroup>
        <Action closeModal>
          <Button variant="soft" color="secondary">
            <Translate id="playground.actions.cancel">Cancel</Translate>
          </Button>
        </Action>
      </ActionGroup>
    </Modal>
  );
}

export default ApiKeyRequired;
