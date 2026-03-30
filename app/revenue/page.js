/**
 * Revenue dashboard page — protected by middleware.
 *
 * Same pattern as the main dashboard page, but reads revenue.html
 * instead of dashboard.html.
 */

import { promises as fs } from "fs";
import path from "path";
import DashboardRenderer from "../dashboard-renderer";

export default async function RevenuePage() {
  const revenuePath = path.join(process.cwd(), "revenue.html");

  let html = "";
  try {
    html = await fs.readFile(revenuePath, "utf-8");
  } catch (e) {
    html = `
      <div style="display:flex;align-items:center;justify-content:center;height:100vh;
        font-family:Arial,sans-serif;background:#0f1117;color:#e2e8f0;">
        <div style="text-align:center;">
          <h1>Revenue dashboard not available yet</h1>
          <p style="color:#8892a4;">The revenue data will be generated on the next scheduled run.</p>
        </div>
      </div>`;
  }

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
  const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi);

  const styles = styleMatch ? styleMatch.join("\n") : "";
  const body = bodyMatch ? bodyMatch[1] : html;

  return <DashboardRenderer styles={styles} body={body} />;
}
