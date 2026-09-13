import { useEffect } from "react";

export default function useUnloadWarning(condition = true) {
 useEffect(() => {
    if (!condition) return;

    const beforeUnloadEvent = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };

    window.addEventListener("beforeunload", beforeUnloadEvent);

    return () => {
      window.removeEventListener("beforeunload", beforeUnloadEvent);
    };
  }, [condition]);
}