import { OpenAPIV3 } from "openapi-types";
import jsonpath from "jsonpath";
import { mergician } from "mergician";
import { isNumber, isString } from "lodash";

export interface OverlaySpec {
  overlay: string;
  info: OverlayInfo;
  extends?: string;
  actions: OverlayAction[];
}

interface OverlayInfo {
  title: string;
  version: string;
}

export interface OverlayAction {
  target: string;
  description?: string;
  update: any;
  remove?: boolean;
}

export interface ApplyOverlayOptions {
  /**
   * Silently skip update actions whose target does not match anything, instead
   * of failing. Useful for generated overlays, which may contain stale entries
   * for operations that have been removed from the spec in the meantime.
   */
  ignoreMissingTargets?: boolean;
}

/**
 * This function was largely inspired by [1].
 *
 * [1]: https://github.com/lornajane/openapi-overlays-js
 *
 * @license Apache-2.0
 * @author @lornajane <https://github.com/lornajane>
 * @param spec
 * @param overlay
 * @param options
 */
export function applyOverlay(
  spec: OpenAPIV3.Document,
  overlay: OverlaySpec,
  options: ApplyOverlayOptions = {},
): OpenAPIV3.Document {
  let overlayedSpec = structuredClone(spec);

  for (const action of overlay.actions) {
    if (action.remove) {
      const path = jsonpath.paths(overlayedSpec, action.target);
      if (path.length === 0) {
        continue;
      }

      const parent = jsonpath.parent(overlayedSpec, action.target);
      const toRemove = path[0][path[0].length - 1];

      if (Array.isArray(parent) && isNumber(toRemove)) {
        parent.splice(toRemove, 1);
      }

      if (!Array.isArray(parent) && isString(toRemove)) {
        delete parent[toRemove];
      }
    } else {
      const path = jsonpath.paths(overlayedSpec, action.target);
      if (path.length === 0) {
        if (options.ignoreMissingTargets) {
          continue;
        }
        throw new Error(`target ${action.target} did not match anything`);
      }

      // It must be an update
      if (action.target === "$") {
        overlayedSpec = merger(action.update)(overlayedSpec);
      } else {
        jsonpath.apply(overlayedSpec, action.target, merger(action.update));
      }
    }
  }

  return overlayedSpec;
}

function merger(obj: any) {
  return (chunk: any) => {
    return mergician({ appendArrays: true })(chunk, obj);
  };
}
