"use client";

/**
 * Client component that renders raw HTML and executes <script> tags.
 *
 * React's dangerouslySetInnerHTML does NOT run <script> tags (browser
 * security — innerHTML never executes scripts). This component works
 * around that by:
 *   1. Separating scripts from the HTML content
 *   2. Rendering the HTML via dangerouslySetInnerHTML
 *   3. Dynamically creating and appending <script> elements in useEffect
 */

import { useEffect, useRef } from "react";

export default function DashboardRenderer({ styles, body }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Find all <script> tags that were injected as inert HTML
    const container = containerRef.current;
    const inertScripts = container.querySelectorAll("script");

    inertScripts.forEach((inert) => {
      const script = document.createElement("script");

      // Copy all attributes (src, type, etc.)
      for (const attr of inert.attributes) {
        script.setAttribute(attr.name, attr.value);
      }

      // Copy inline script content
      if (inert.textContent) {
        script.textContent = inert.textContent;
      }

      // Replace the inert script with the live one so the browser executes it
      inert.parentNode.replaceChild(script, inert);
    });
  }, [body]);

  return (
    <>
      {styles && <div dangerouslySetInnerHTML={{ __html: styles }} />}
      <div ref={containerRef} dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
