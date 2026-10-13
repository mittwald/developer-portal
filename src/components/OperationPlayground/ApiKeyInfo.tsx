import {
  AccentBox,
  Button,
  Flex,
  IconSshKey,
  Section,
  Text,
} from "@mittwald/flow-react-components";
import Translate from "@docusaurus/Translate";
import React from "react";
import ApiKeyForm from "./ApiKeyForm";
import styles from "./index.module.css";

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
      <IconSshKey color="var(--icon--color)" />
      <Section>
        {/* On narrow screens the buttons move to the next line as a whole
            instead of breaking their labels */}
        <Flex align="center" wrap="wrap" gap="s">
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
          <Flex wrap="wrap" gap="s" className={styles.apiKeyActions}>
            <ApiKeyForm
              isVerifying={isVerifying}
              error={verificationError}
              onSubmit={onSaveApiKey}
            >
              <Button variant="soft" color="dark" size="s">
                <Translate id="playground.apikey.change">
                  Change API key
                </Translate>
              </Button>
            </ApiKeyForm>
            <Button
              variant="soft"
              color="dark"
              size="s"
              onPress={onClearApiKey}
            >
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
