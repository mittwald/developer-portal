import {
  AccentBox,
  Button,
  Flex,
  Icon,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import Translate from "@docusaurus/Translate";
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
              <Translate
                id="playground.apikey.executing-as"
                values={{ email: <strong>{userEmail}</strong> }}
              >
                {"Executing as {email}"}
              </Translate>
            </Text>
          </Flex>
          <Flex>
            <ApiKeyForm
              isVerifying={isVerifying}
              error={verificationError}
              onSubmit={onSaveApiKey}
            >
              <Button variant="plain">
                <Translate id="playground.apikey.change">
                  Change API key
                </Translate>
              </Button>
            </ApiKeyForm>
            <Button variant="plain" color="danger" onClick={onClearApiKey}>
              <Translate id="playground.apikey.forget">
                Forget API key
              </Translate>
            </Button>
          </Flex>
        </Flex>
      </Section>
    </AccentBox>
  );
}

export default ApiKeyInfo;
