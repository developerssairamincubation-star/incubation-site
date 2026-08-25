"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

type IntroContextValue = {
  /** True once the intro video overlay has finished (or was skipped). */
  introDone: boolean;
  finishIntro: () => void;
};

const IntroContext = createContext<IntroContextValue>({
  introDone: false,
  finishIntro: () => {},
});

export function IntroProvider({ children }: { children: React.ReactNode }) {
  const [introDone, setIntroDone] = useState(false);
  const finishIntro = useCallback(() => setIntroDone(true), []);
  const value = useMemo(
    () => ({ introDone, finishIntro }),
    [introDone, finishIntro],
  );

  return <IntroContext.Provider value={value}>{children}</IntroContext.Provider>;
}

export function useIntro() {
  return useContext(IntroContext);
}
