import React, { type ReactNode } from "react";
import clsx from "clsx";
import Translate from "@docusaurus/Translate";
import type { Props } from "@theme/NotFound/Content";
import {
  Heading,
  Icon,
  IllustratedMessage,
  Text,
} from "@mittwald/flow-react-components";
import { IconError404 } from "@tabler/icons-react";
import styles from "./styles.module.css";

/**
 * The 404 page as Flow illustrated message. Ejected from
 * @docusaurus/theme-classic.
 */
export default function NotFoundContent({ className }: Props): ReactNode {
  return (
    <main className={clsx("container", styles.notFound, className)}>
      <IllustratedMessage>
        <Icon>
          <IconError404 />
        </Icon>
        <Heading level={1}>
          <Translate
            id="theme.NotFound.title"
            description="The title of the 404 page"
          >
            Page Not Found
          </Translate>
        </Heading>
        <Text>
          <Translate
            id="theme.NotFound.p1"
            description="The first paragraph of the 404 page"
          >
            We could not find what you were looking for.
          </Translate>{" "}
          <Translate
            id="theme.NotFound.p2"
            description="The 2nd paragraph of the 404 page"
          >
            Please contact the owner of the site that linked you to the original
            URL and let them know their link is broken.
          </Translate>
        </Text>
      </IllustratedMessage>
    </main>
  );
}
