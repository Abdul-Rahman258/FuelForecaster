"use client";
import { useState, useEffect } from "react";

const listeners: Set<(lang: string) => void> = new Set();
let currentLang = "en";

export function setGlobalLanguage(lang: string) {
  currentLang = lang;
  listeners.forEach(fn => fn(lang));
}

export function useLanguage() {
  const [lang, setLangState] = useState(currentLang);
  useEffect(() => {
    listeners.add(setLangState);
    return () => { listeners.delete(setLangState); };
  }, []);
  return { lang, setLanguage: setGlobalLanguage };
}
