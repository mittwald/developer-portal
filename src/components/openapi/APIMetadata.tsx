import { Content } from "@mittwald/flow-react-components";
import { LabeledValue } from "@mittwald/flow-react-components";
import { Label } from "@mittwald/flow-react-components";
import { ColumnLayout } from "@mittwald/flow-react-components";

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
          <Label>API version</Label>
          <Content>{version}</Content>
        </LabeledValue>
        <LabeledValue>
          <Label>Base URL</Label>
          <Content>{baseURL}</Content>
        </LabeledValue>
      </ColumnLayout>
    </>
  );
}
