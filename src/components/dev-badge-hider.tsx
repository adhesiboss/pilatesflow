// src/components/dev-badge-hider.tsx
"use client";

import { useEffect } from "react";

export function DevBadgeHider() {
  useEffect(() => {
    const hideBadge = () => {
      const nodes = document.querySelectorAll<HTMLElement>("[data-next-badge-root]");
      nodes.forEach((el) => {
        el.style.display = "none";
      });
    };

    // Ocultamos al montar
    hideBadge();

    // Y si Next lo vuelve a crear, lo volvemos a ocultar
    const observer = new MutationObserver(() => {
      hideBadge();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => observer.disconnect();
  }, []);

  return null;
}