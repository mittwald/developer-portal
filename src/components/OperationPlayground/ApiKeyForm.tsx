import {
  Action,
  ActionGroup,
  Button,
  Content,
  FieldDescription,
  Heading,
  Label,
  Modal,
  ModalTrigger,
  Section,
  TextField,
  Alert,
} from "@mittwald/flow-react-components";
import Translate from "@docusaurus/Translate";
import React, { useState } from "react";

export interface ApiKeyFormProps {
  /** Whether API key verification is in progress */
  isVerifying: boolean;
  /** Error message to display */
  error: string | undefined;
  /** Callback when user submits the API key */
  onSubmit: (apiKey: string) => Promise<boolean>;
  /** The trigger element that opens the form */
  children: React.ReactNode;
}

/**
 * Modal form for entering and verifying an mStudio API key.
 * Validates the key by calling the user profile endpoint.
 */
function ApiKeyForm({
  isVerifying,
  error,
  onSubmit,
  children,
}: ApiKeyFormProps) {
  const [apiKey, setApiKey] = useState("");

  const handleSubmit = async () => {
    const success = await onSubmit(apiKey);
    if (success) {
      setApiKey("");
    }
  };

  return (
    <ModalTrigger>
      {children}
      <Modal size="s">
        <Heading>
          <Translate id="playground.apikey.form.title">
            Configure API Key
          </Translate>
        </Heading>
        <Content>
          <Section>
            <TextField
              value={apiKey}
              onChange={setApiKey}
              type="password"
              isRequired
            >
              <Label>
                <Translate id="playground.apikey.form.label">
                  mStudio API Token
                </Translate>
              </Label>
              <FieldDescription>
                <Translate id="playground.apikey.form.description">
                  Enter your mStudio API token. You can create one in the
                  mStudio dashboard under Account Settings → API Tokens.
                </Translate>
              </FieldDescription>
            </TextField>
          </Section>
          {error && (
            <Alert status="danger">
              <Heading>{error}</Heading>
            </Alert>
          )}
        </Content>
        <ActionGroup>
          <Action onAction={handleSubmit}>
            <Button color="accent" isPending={isVerifying}>
              <Translate id="playground.apikey.form.submit">
                Verify & Save
              </Translate>
            </Button>
          </Action>
          <Action closeModal>
            <Button variant="soft" color="secondary">
              <Translate id="playground.actions.cancel">Cancel</Translate>
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
}

export default ApiKeyForm;
