import {
  Accordion,
  Content,
  Heading,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@mittwald/flow-react-components";
import Translate, { translate } from "@docusaurus/Translate";
import React from "react";

export interface ResponseHeadersProps {
  /** The Headers object from the fetch Response */
  headers: Headers;
}

/**
 * Renders response headers in a collapsible accordion with a two-column table.
 * Collapsed by default to reduce visual clutter.
 */
function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const headersAsArray: [string, string][] = [];
  headers.forEach((v, k) => {
    headersAsArray.push([k, v]);
  });

  return (
    <Accordion defaultExpanded={false} variant="outline">
      <Heading>
        <Translate id="playground.response.headers">Headers</Translate>
      </Heading>
      <Content>
        <Table
          aria-label={translate({
            id: "playground.response.headers.aria-label",
            message: "Response headers",
          })}
        >
          <TableHeader>
            <TableColumn>
              <Translate id="playground.response.headers.header">
                Header
              </Translate>
            </TableColumn>
            <TableColumn>
              <Translate id="playground.response.headers.value">
                Value
              </Translate>
            </TableColumn>
          </TableHeader>
          <TableBody>
            {headersAsArray.map(([key, value], idx) => (
              <TableRow key={idx}>
                <TableCell>{key}</TableCell>
                <TableCell>{value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Content>
    </Accordion>
  );
}

export default ResponseHeaders;
