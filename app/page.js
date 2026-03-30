/**
 * Main dashboard page — protected by middleware.
 *
 * If you reach this page, you're already authenticated (middleware checked).
 * This reads the dashboard.html file and serves it as the page content.
 */

import { promises as fs } from "fs";
import path from "path";

export default async function DashboardPage() {
  // Read the dashboard HTML that the pipeline pushes
  const dashboardPath = path.join(process.cwd(), "dashboard.html");

  let html = "";
  try {
    html = await fs.readFile(dashboardPath, "utf-8");
  } catch (e) {
    html = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;
        font-family:Arial,sans-serif;background:#0f1117;color:#e2e8f0;">
        <div style="text-align:center;">
          <h1>Dashboard not available yet</h1>
          <p style="color:#8892a4;">The weekly monitor will be generated on the next scheduled run.</p>
        </div>
      </div>`;
  }

  // Extract just the <body> content if it's a full HTML document
  // (so we don't nest <html> inside <html>)
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);

  const styles = styleMatch ? styleMatch.join("\n") : "";
  const body = bodyMatch ? bodyMatch[1] : html;

  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: styles }} />
      <div dangerouslySetInnerHTML={{ __html: body }} />
    </>
  );
}
