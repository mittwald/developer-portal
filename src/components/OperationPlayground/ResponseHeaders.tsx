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
import React from "react";

export interface ResponseHeadersProps {
  headers: Headers;
}

function ResponseHeaders({ headers }: ResponseHeadersProps) {
  const headersAsArray: [string, string][] = [];
  headers.forEach((v, k) => {
    headersAsArray.push([k, v]);
  });

  return (
    <Accordion defaultExpanded={false} variant="outline">
      <Heading>Headers</Heading>
      <Content>
        <Table aria-label="Response headers">
          <TableHeader>
            <TableColumn>Header</TableColumn>
            <TableColumn>Value</TableColumn>
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
