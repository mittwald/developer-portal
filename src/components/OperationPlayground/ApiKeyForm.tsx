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
        <Heading>Configure API Key</Heading>
        <Content>
          <Section>
            <TextField
              value={apiKey}
              onChange={setApiKey}
              type="password"
              isRequired
            >
              <Label>mStudio API Token</Label>
              <FieldDescription>
                Enter your mStudio API token. You can create one in the mStudio
                dashboard under Account Settings → API Tokens.
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
          <Action closeModal>
            <Action onAction={handleSubmit}>
              <Button color="accent" isPending={isVerifying}>
                Verify & Save
              </Button>
            </Action>
            <Button variant="soft" color="secondary">
              Cancel
            </Button>
          </Action>
        </ActionGroup>
      </Modal>
    </ModalTrigger>
  );
}

export default ApiKeyForm;
