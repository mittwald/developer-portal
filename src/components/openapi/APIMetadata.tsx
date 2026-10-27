import { Content } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";
import Translate from "@docusaurus/Translate";

export default function APIMetadata({
  version,
  baseURL,
}: {
  version: string;
  baseURL: string;
}) {
  return (
    <>
      <ColumnLayout m={[1, 5]}>
        <LabeledValue>
          <Label>
            <Translate id="openapi.metadata.apiversion">API version</Translate>
          </Label>
          <Content>{version}</Content>
        </LabeledValue>
        <LabeledValue>
          <Label>
            <Translate id="openapi.metadata.baseurl">Base URL</Translate>
          </Label>
          <Content>{baseURL}</Content>
        </LabeledValue>
      </ColumnLayout>
    </>
  );
}
