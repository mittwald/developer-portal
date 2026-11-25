/**
 * Class that shows its content in Flow's dark color mode, whatever the page's
 * color mode (see flowDarkScope.ts). Kept apart from the plugin, which reads
 * files and must not end up in the client bundle.
 */
export const FLOW_DARK_SCOPE_CLASS = "flow-dark-scope";
