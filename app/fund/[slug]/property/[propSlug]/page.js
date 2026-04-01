/**
 * Property Detail page — /fund/[slug]/property/[propSlug]
 *
 * Shows a single unit's tenant, lease, financial details and alert flags.
 */

import { promises as fs } from "fs";
import path from "path";
import { notFound } from "next/navigation";

function fmt(n) {
  if (n == null || n === 0) return "—";
  const sign = n < 0 ? "-" : "";
  return sign + "$" + Math.abs(n).toLocaleString("en-US", { minimumFractionDigits: 0 });
}

function fmtBalance(n) {
  if (n == null || n === 0) return null;
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 0 });
}

async function getData(slug, propSlug) {
  try {
    const dataPath = path.join(process.cwd(), "data.json");
    const raw = await fs.readFile(dataPath, "utf-8");
    const data = JSON.parse(raw);
    const fund = data.funds.find((f) => f.slug === slug);
    if (!fund) return null;
    const unit = fund.units.find((u) => u.slug === propSlug);
    return unit ? { fund, unit } : null;
  } catch {
    return null;
  }
}

export default async function PropertyPage({ params }) {
  const { slug, propSlug } = await params;
  const result = await getData(slug, propSlug);
  if (!result) notFound();

  const { fund, unit } = result;
  const balance = fmtBalance(unit.balance);
  const isDelinquent = unit.alert_flags.includes("delinquent");
  const isExpired = unit.alert_flags.includes("expired_lease");
  const isExpiring = unit.alert_flags.includes("expiring_soon");

  let daysLabel = null;
  if (unit.days_remaining != null) {
    if (unit.days_remaining < 0) {
      daysLabel = { text: `${Math.abs(unit.days_remaining)} days overdue`, color: "#fc8181" };
    } else if (unit.days_remaining <= 60) {
      daysLabel = { text: `${unit.days_remaining} days remaining`, color: "#f6e05e" };
    } else {
      daysLabel = { text: `${unit.days_remaining} days remaining`, color: "#8892a4" };
    }
  }

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0f1117", minHeight: "100vh", color: "#e2e8f0" }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        a { color: inherit; }
        .page { max-width: 800px; margin: 0 auto; padding: 24px 20px; }
        .breadcrumb { display: flex; align-items: center; gap: 8px; font-size: 13px; color: #8892a4; margin-bottom: 24px; flex-wrap: wrap; }
        .breadcrumb a { text-decoration: none; }
        .breadcrumb a:hover { color: #e2e8f0; }
        .breadcrumb-sep { color: #4a5568; }
        .header { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 32px; flex-wrap: wrap; }
        h1 { font-size: 24px; font-weight: 700; margin-bottom: 6px; }
        .fund-link { font-size: 14px; color: #8892a4; text-decoration: none; }
        .fund-link:hover { color: #e2e8f0; }
        .alert-flags { display: flex; gap: 8px; flex-wrap: wrap; }
        .badge { display: inline-block; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 600; }
        .badge-green { background: rgba(104,211,145,0.15); color: #68d391; }
        .badge-red { background: rgba(252,129,130,0.15); color: #fc8181; }
        .badge-yellow { background: rgba(246,224,94,0.15); color: #f6e05e; }
        .badge-orange { background: rgba(252,129,74,0.15); color: #fc814a; }
        .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; margin-bottom: 24px; }
        .card { background: #1a1f2e; border: 1px solid #2d3748; border-radius: 12px; padding: 20px; }
        .card-label { font-size: 12px; color: #8892a4; text-transform: uppercase; letter-spacing: .05em; margin-bottom: 8px; }
        .card-val { font-size: 20px; font-weight: 700; }
        .card-sub { font-size: 12px; color: #8892a4; margin-top: 4px; }
        .section { background: #1a1f2e; border: 1px solid #2d3748; border-radius: 12px; overflow: hidden; margin-bottom: 24px; }
        .section-header { padding: 16px 20px; border-bottom: 1px solid #2d3748; font-weight: 600; font-size: 15px; }
        .detail-grid { padding: 20px; display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .detail-item { }
        .detail-label { font-size: 12px; color: #8892a4; margin-bottom: 4px; }
        .detail-val { font-size: 15px; }
        .tab-bar { display: flex; gap: 4px; background: #1a1f2e; border: 1px solid #2d3748; border-radius: 10px; padding: 4px; width: fit-content; margin-bottom: 24px; }
        .tab { padding: 7px 18px; border-radius: 7px; font-size: 13px; font-weight: 500; text-decoration: none; color: #8892a4; transition: all .15s; }
        .tab.active { background: #2d3748; color: #e2e8f0; }
        .tab:hover:not(.active) { color: #e2e8f0; }
        @media (max-width: 640px) {
          .page { padding: 16px; }
          h1 { font-size: 18px; }
          .cards { grid-template-columns: repeat(2, 1fr); gap: 10px; }
          .card-val { font-size: 17px; }
          .detail-grid { grid-template-columns: 1fr; padding: 16px; }
          .section-header { padding: 12px 16px; }
          .breadcrumb { font-size: 12px; }
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
          <a href={`/fund/${fund.slug}`}>{fund.entity}</a>
          <span className="breadcrumb-sep">›</span>
          <span>{unit.address}</span>
        </div>

        {/* Header */}
        <div className="header">
          <div>
            <h1>{unit.address}</h1>
            <a href={`/fund/${fund.slug}`} className="fund-link">{fund.entity}</a>
          </div>
          <div className="alert-flags">
            <span className={`badge ${unit.status === "Occupied" ? "badge-green" : "badge-red"}`}>
              {unit.status}
            </span>
            {isDelinquent && <span className="badge badge-red">Delinquent</span>}
            {isExpired && <span className="badge badge-orange">Expired Lease</span>}
            {isExpiring && <span className="badge badge-yellow">Expiring Soon</span>}
          </div>
        </div>

        {/* KPI cards */}
        <div className="cards">
          <div className="card">
            <div className="card-label">Market Rent</div>
            <div className="card-val">{fmt(unit.market_rent)}<span style={{fontSize:"13px",color:"#8892a4"}}>/mo</span></div>
          </div>

          <div className="card">
            <div className="card-label">Balance Due</div>
            <div className="card-val" style={{color: isDelinquent ? "#fc8181" : "#68d391"}}>
              {balance || "$0"}
            </div>
            {isDelinquent && <div className="card-sub" style={{color:"#fc8181"}}>Past due</div>}
          </div>

          <div className="card">
            <div className="card-label">Lease End</div>
            <div className="card-val" style={{fontSize:"17px", color: isExpired ? "#fc8181" : isExpiring ? "#f6e05e" : "inherit"}}>
              {unit.lease_end ?? "—"}
            </div>
            {daysLabel && <div className="card-sub" style={{color: daysLabel.color}}>{daysLabel.text}</div>}
          </div>
        </div>

        {/* Details section */}
        <div className="section">
          <div className="section-header">Lease Details</div>
          <div className="detail-grid">
            <div className="detail-item">
              <div className="detail-label">Tenant</div>
              <div className="detail-val">{unit.tenant || "—"}</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Status</div>
              <div className="detail-val">
                <span className={`badge ${unit.status === "Occupied" ? "badge-green" : "badge-red"}`}>
                  {unit.status}
                </span>
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Market Rent</div>
              <div className="detail-val">{fmt(unit.market_rent)}/mo</div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Balance Due</div>
              <div className="detail-val" style={{color: isDelinquent ? "#fc8181" : "inherit"}}>
                {balance || "None"}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Lease End</div>
              <div className="detail-val" style={{color: isExpired ? "#fc8181" : isExpiring ? "#f6e05e" : "inherit"}}>
                {unit.lease_end ?? "—"}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Days Remaining</div>
              <div className="detail-val" style={{color: daysLabel?.color ?? "inherit"}}>
                {daysLabel ? daysLabel.text : "—"}
              </div>
            </div>
            <div className="detail-item">
              <div className="detail-label">Fund</div>
              <div className="detail-val">
                <a href={`/fund/${fund.slug}`} style={{color:"#63b3ed", textDecoration:"none"}}>
                  {fund.entity}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
