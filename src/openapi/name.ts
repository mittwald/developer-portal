import { deburr, isPlainObject, trim, upperFirst } from "lodash";

/**
 * Copied from json-schema-to-typescript
 *
 * @see https://github.com/bcherny/json-schema-to-typescript/blob/89a7b326ef18c75ad801ca93c780df8fd69ab644/src/utils.ts#L163-L184
 * @licence MIT
 * @param string
 */
export function toSafeString(string: string) {
  // identifiers in javaScript/ts:
  // First character: a-zA-Z | _ | $
  // Rest: a-zA-Z | _ | $ | 0-9

  return upperFirst(
    // remove accents, umlauts, ... by their basic latin letters
    deburr(string)
      // replace chars which are not valid for typescript identifiers with whitespace
      .replace(/(^\s*[^a-zA-Z_$])|([^a-zA-Z_$\d])/g, " ")
      // uppercase leading underscores followed by lowercase
      .replace(/^_[a-z]/g, (match) => match.toUpperCase())
      // remove non-leading underscores followed by lowercase (convert snake_case)
      .replace(/_[a-z]/g, (match) =>
        match.substr(1, match.length).toUpperCase(),
      )
      // uppercase letters after digits, dollars
      .replace(/([\d$]+[a-zA-Z])/g, (match) => match.toUpperCase())
      // uppercase first letter after whitespace
      .replace(/\s+([a-zA-Z])/g, (match) => trim(match.toUpperCase()))
      // remove remaining whitespace
      .replace(/\s/g, ""),
  );
}

export const tsTypeName = (name: string): string => {
  const nameStartsWithNumber = /^\d/.test(name);
  const almostSafeString = nameStartsWithNumber ? `$${name}` : name;
  return toSafeString(almostSafeString);
};
