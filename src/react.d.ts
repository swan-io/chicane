import "react";

declare module "react" {
  export function useSyncExternalStore<T>(
    subscribe: (subscription: () => void) => () => void,
    getSnapshot: () => T,
  ): T;
}
