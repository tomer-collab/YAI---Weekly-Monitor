/**
 * Fund Profile page — /fund/[slug]
 *
 * Reads data.json (pushed by pipeline) and renders a fund detail page
 * showing KPIs, all units, monthly financials chart, and lease alerts.
 */

import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";
import FundCharts from "./FundCharts";

function fmt(n) {
  if (n == null) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function fmtPct(n) {
  if (n == null) return "—";
  return n.toFixed(1) + "%";
}

async function getData(slug) {
  try {
    const dataPath = path.join(process.cwd(), "data.json");
    const raw = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(raw);
    return data.funds.find((f) => f.slug === slug) ?? null;
  } catch {
    return null;
  }
}

export default async function FundPage({ params }) {
  const { slug } = await params;
  const fund = await getData(slug);
  if (!fund) notFound();

  const k = fund.kpis;
  const noiPositive = k.ytd_noi >= 0;

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; }
        .page { max-width: 1200px; margin: 0 auto; padding: 24px 20px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #8892a4; margin-bottom: 24px; }
        .breadcrumb a { text-decoration: none; }
        .breadcrumb a:hover { color: #e2e8f0; }
        .breadcrumb-sep { color: #4a5568; }
        h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
        .subtitle { color: #8892a4; font-size: 14px; margin-bottom: 32px; }
        .kpi-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .kpi-card { background: #1a1f2e; border: 1px solid #2d3748; border-radius: 12px; padding: 20px; }
        .kpi-label { font-size: 12px; color: #8892a4; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
        .kpi-val { font-size: 22px; font-weight: 700; }
        .kpi-val.positive { color: #68d391; }
        .kpi-val.negative { color: #fc8181; }
        .section { background: #1a1f2e; border: 1px solid #2d3748; border-radius: 12px; margin-bottom: 24px; overflow: hidden; }
        .section-header { padding: 16px 20px; border-bottom: 1px solid #2d3748; font-weight: 600; font-size: 15px; }
        .section-body { padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 14px; }
        th { text-align: left; padding: 10px 12px; color: #8892a4; font-weight: 600; font-size: 12px; text-transform: uppercase; border-bottom: 1px solid #2d3748; white-space: nowrap; }
        td { padding: 10px 12px; border-bottom: 1px solid #1e2533; white-space: nowrap; }
        .table-scroll { overflow-x: auto; }
        tr:last-child td { border-bottom: none; }
        tr:hover td { background: rgba(255,255,255,0.02); }
        .num { text-align: right; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 9999px; font-size: 11px; font-weight: 600; }
        .badge-green { background: rgba(104,211,145,0.15); color: #68d391; }
        .badge-red { background: rgba(252,129,130,0.15); color: #fc8181; }
        .badge-yellow { background: rgba(246,224,94,0.15); color: #f6e05e; }
        .badge-orange { background: rgba(252,129,74,0.15); color: #fc814a; }
        .alert-flags { display: flex; gap: 6px; flex-wrap: wrap; }
        td a { text-decoration: none; color: #e2e8f0; }
        td a:hover { text-decoration: underline; color: #63b3ed; }
        .empty { color: #8892a4; font-size: 13px; padding: 16px 0; text-align: center; }
        .tab-bar { display: flex; gap: 4px; background: #1a1f2e; border: 1px solid #2d3748; border-radius: 10px; padding: 4px; width: fit-content; margin-bottom: 24px; }
        .tab { padding: 7px 18px; border-radius: 7px; font-size: 13px; font-weight: 500; text-decoration: none; color: #8892a4; transition: all .15s; }
        .tab.active { background: #2d3748; color: #e2e8f0; }
        .tab:hover:not(.active) { color: #e2e8f0; }
        @media (max-width: 640px) {
          .page { padding: 16px; }
          h1 { font-size: 20px; }
          .kpi-grid { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 20px; }
          .kpi-val { font-size: 18px; }
          .section-header { padding: 12px 16px; font-size: 14px; }
          .section-body { padding: 0; }
          .table-scroll table { width: max-content; min-width: 100%; }
          .section { overflow: visible; }
        }
      `}</style>

      <div className="page">
        {/* Tab bar */}
        <div className="tab-bar">
          <a href="/" className="tab">Operations</a>
          <a href="/revenue" className="tab">Revenue</a>
        </div>

        {/* Breadcrumb */}
        <div className="breadcrumb">
          <a href="/">Dashboard</a>
          <span className="breadcrumb-sep">›</span>
          <span>{fund.entity}</span>
        </div>

        <h1>{fund.entity}</h1>
        <div className="subtitle">{k.total_units} units · {fmtPct(k.occupancy_pct)} occupied</div>

        {/* KPI Cards */}
        <div className="kpi-grid">
          <div className="kpi-card">
            <div className="kpi-label">Total Units</div>
            <div className="kpi-val">{k.total_units}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Occupied</div>
            <div className="kpi-val">{k.occupied_units} <span style={{fontSize:"14px",color:"#8892a4"}}>/ {k.total_units}</span></div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Occupancy</div>
            <div className={`kpi-val ${k.occupancy_pct >= 90 ? "positive" : k.occupancy_pct < 75 ? "negative" : ""}`}>
              {fmtPct(k.occupancy_pct)}
            </div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Monthly Rent</div>
            <div className="kpi-val">{fmt(k.monthly_rent)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Vacant Loss</div>
            <div className={`kpi-val ${k.vacant_loss > 0 ? "negative" : ""}`}>{fmt(k.vacant_loss)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">Delinquency</div>
            <div className={`kpi-val ${k.total_delinquency > 0 ? "negative" : "positive"}`}>{fmt(k.total_delinquency)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">YTD Income</div>
            <div className="kpi-val">{fmt(k.ytd_income)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">YTD Expense</div>
            <div className="kpi-val negative">{fmt(k.ytd_expense)}</div>
          </div>
          <div className="kpi-card">
            <div className="kpi-label">YTD NOI</div>
            <div className={`kpi-val ${noiPositive ? "positive" : "negative"}`}>{fmt(k.ytd_noi)}</div>
          </div>
        </div>

        {/* Monthly Chart */}
        {fund.monthly_financials.length > 0 && (
          <div className="section">
            <div className="section-header">Monthly Income · Expense · NOI</div>
            <div className="section-body">
              <FundCharts monthlyFinancials={fund.monthly_financials} />
            </div>
          </div>
        )}

        {/* All Units */}
        <div className="section">
          <div className="section-header">All Units ({fund.units.length})</div>
          {fund.units.length === 0 ? (
            <div className="empty">No unit data available.</div>
          ) : (
            <div className="table-scroll"><table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Tenant</th>
                  <th>Status</th>
                  <th className="num">Market Rent</th>
                  <th className="num">Balance Due</th>
                  <th>Lease End</th>
                  <th>Alerts</th>
                </tr>
              </thead>
              <tbody>
                {fund.units.map((u) => (
                  <tr key={u.slug}>
                    <td>
                      <a href={`/fund/${fund.slug}/property/${u.slug}`}>{u.address}</a>
                    </td>
                    <td>{u.tenant || <span style={{color:"#4a5568"}}>—</span>}</td>
                    <td>
                      <span className={`badge ${u.status === "Occupied" ? "badge-green" : "badge-red"}`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="num">{fmt(u.market_rent)}</td>
                    <td className="num" style={{color: u.balance > 0 ? "#fc8181" : "inherit"}}>
                      {u.balance > 0 ? fmt(u.balance) : <span style={{color:"#4a5568"}}>—</span>}
                    </td>
                    <td style={{color: u.days_remaining != null && u.days_remaining < 0 ? "#fc8181" : u.days_remaining != null && u.days_remaining <= 60 ? "#f6e05e" : "inherit"}}>
                      {u.lease_end ?? <span style={{color:"#4a5568"}}>—</span>}
                    </td>
                    <td>
                      <div className="alert-flags">
                        {u.alert_flags.includes("delinquent") && <span className="badge badge-red">Delinquent</span>}
                        {u.alert_flags.includes("expired_lease") && <span className="badge badge-orange">Expired</span>}
                        {u.alert_flags.includes("expiring_soon") && <span className="badge badge-yellow">Expiring</span>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
        </div>

        {/* Delinquencies */}
        {fund.delinquencies.length > 0 && (
          <div className="section">
            <div className="section-header">Delinquent Tenants ({fund.delinquencies.length})</div>
            <div className="table-scroll"><table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Tenant</th>
                  <th className="num">Balance Due</th>
                </tr>
              </thead>
              <tbody>
                {fund.delinquencies.map((d) => (
                  <tr key={d.slug}>
                    <td><a href={`/fund/${fund.slug}/property/${d.slug}`}>{d.address}</a></td>
                    <td>{d.tenant}</td>
                    <td className="num" style={{color:"#fc8181"}}>{fmt(d.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}

        {/* Expired Leases */}
        {fund.expired_leases.length > 0 && (
          <div className="section">
            <div className="section-header">Expired Leases ({fund.expired_leases.length})</div>
            <div className="table-scroll"><table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Tenant</th>
                  <th>Lease End</th>
                  <th className="num">Days Overdue</th>
                </tr>
              </thead>
              <tbody>
                {fund.expired_leases.map((l) => (
                  <tr key={l.slug}>
                    <td><a href={`/fund/${fund.slug}/property/${l.slug}`}>{l.address}</a></td>
                    <td>{l.tenant}</td>
                    <td style={{color:"#fc8181"}}>{l.lease_end}</td>
                    <td className="num" style={{color:"#fc8181"}}>{Math.abs(l.days_remaining)} days</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}

        {/* Expiring Soon */}
        {fund.expiring_soon.length > 0 && (
          <div className="section">
            <div className="section-header">Expiring Soon ({fund.expiring_soon.length})</div>
            <div className="table-scroll"><table>
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Tenant</th>
                  <th>Lease End</th>
                  <th className="num">Days Remaining</th>
                </tr>
              </thead>
              <tbody>
                {fund.expiring_soon.map((l) => (
                  <tr key={l.slug}>
                    <td><a href={`/fund/${fund.slug}/property/${l.slug}`}>{l.address}</a></td>
                    <td>{l.tenant}</td>
                    <td style={{color:"#f6e05e"}}>{l.lease_end}</td>
                    <td className="num" style={{color:"#f6e05e"}}>{l.days_remaining} days</td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          </div>
        )}
      </div>
    </div>
  );
}
