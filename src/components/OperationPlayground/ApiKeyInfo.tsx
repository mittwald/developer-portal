import {
  AccentBox,
  Button,
  Flex,
  Icon,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import { IconKey } from "@tabler/icons-react";
import React from "react";
import ApiKeyForm from "./ApiKeyForm";

export interface ApiKeyInfoProps {
  /** The user's email address */
  userEmail: string;
  /** Whether API key verification is in progress */
  isVerifying: boolean;
  /** Error message from verification */
  verificationError: string | undefined;
  /** Callback to save a new API key */
  onSaveApiKey: (key: string) => Promise<boolean>;
  /** Callback to clear the stored API key */
  onClearApiKey: () => void;
}

/**
 * Displays the current API key status with the authenticated user's email
 * and provides buttons to change or forget the API key.
 */
function ApiKeyInfo({
  userEmail,
  isVerifying,
  verificationError,
  onSaveApiKey,
  onClearApiKey,
}: ApiKeyInfoProps) {
  return (
    <AccentBox>
      <Icon>
        <IconKey />
      </Icon>
      <Section>
        <Flex align="center">
          <Flex grow>
            <Text>
              Executing as <strong>{userEmail}</strong>
            </Text>
          </Flex>
          <Flex>
            <ApiKeyForm
              isVerifying={isVerifying}
              error={verificationError}
              onSubmit={onSaveApiKey}
            >
              <Button variant="plain">Change API key</Button>
            </ApiKeyForm>
            <Button variant="plain" color="danger" onClick={onClearApiKey}>
              Forget API key
            </Button>
          </Flex>
        </Flex>
      </Section>
    </AccentBox>
  );
}

export default ApiKeyInfo;
