import React, { Fragment, ReactNode } from "react";

interface LinkGroupProps {
  title: ReactNode;
  links: ReactNode[];
}

export default function LinkGroup({ title, links }: LinkGroupProps) {
  return (
    <>
      <strong>{title}</strong>
      <br />
      {links.map((link, i) => (
        <Fragment key={i}>
          {link}
          {i < links.length - 1 && " | "}
        </Fragment>
      ))}
    </>
  );
}
