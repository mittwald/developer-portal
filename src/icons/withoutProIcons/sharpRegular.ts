/*
 * Stands in for `@fortawesome/sharp-regular-svg-icons` when the FontAwesome Pro
 * icons are not installed (see `docusaurus.config.ts`), and is what TypeScript
 * checks the imports against (`paths` in `tsconfig.json`), so type checks need
 * no license. A Pro-only icon needs a free substitute here.
 */
export * from "@fortawesome/free-solid-svg-icons";
export {
  faTurnDown as faArrowTurnDownLeft,
  faRobot as faUserRobot,
} from "@fortawesome/free-solid-svg-icons";
