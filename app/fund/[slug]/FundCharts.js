"use client";

import { useEffect, useRef } from "react";

export default function FundCharts({ monthlyFinancials }) {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!monthlyFinancials || monthlyFinancials.length === 0) return;
    if (!chartRef.current) return;

    const loadChart = async () => {
      // Dynamically import Chart.js so it only loads client-side
      if (typeof window === "undefined") return;
      if (!window.Chart) {
        await new Promise((resolve, reject) => {
          const s = document.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/chart.js@4";
          s.onload = resolve;
          s.onerror = reject;
          document.head.appendChild(s);
        });
      }

      if (chartInstance.current) {
        chartInstance.current.destroy();
      }

      const labels = monthlyFinancials.map((m) => m.month_label);
      const incomes = monthlyFinancials.map((m) => m.income);
      const expenses = monthlyFinancials.map((m) => m.expense);
      const nois = monthlyFinancials.map((m) => m.noi);

      chartInstance.current = new window.Chart(chartRef.current, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: "Income",
              data: incomes,
              backgroundColor: "rgba(99,179,237,0.7)",
              borderColor: "#63b3ed",
              borderWidth: 1,
              order: 2,
            },
            {
              label: "Expense",
              data: expenses,
              backgroundColor: "rgba(252,129,74,0.7)",
              borderColor: "#fc814a",
              borderWidth: 1,
              order: 3,
            },
            {
              label: "NOI",
              data: nois,
              type: "line",
              borderColor: "#68d391",
              backgroundColor: "rgba(104,211,145,0.15)",
              pointBackgroundColor: "#68d391",
              borderWidth: 2,
              fill: false,
              tension: 0.3,
              order: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { labels: { color: "#e2e8f0" } },
            tooltip: {
              callbacks: {
                label: (ctx) => {
                  const val = ctx.parsed.y;
                  const sign = val < 0 ? "-" : "";
                  return ` ${ctx.dataset.label}: ${sign}$${Math.abs(val).toLocaleString("en-US", { minimumFractionDigits: 0 })}`;
                },
              },
            },
          },
          scales: {
            x: { ticks: { color: "#8892a4" }, grid: { color: "rgba(255,255,255,0.05)" } },
            y: {
              ticks: {
                color: "#8892a4",
                callback: (v) => "$" + (v / 1000).toFixed(0) + "k",
              },
              grid: { color: "rgba(255,255,255,0.05)" },
            },
          },
        },
      });
    };

    loadChart();
    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [monthlyFinancials]);

  if (!monthlyFinancials || monthlyFinancials.length === 0) return null;

  return (
    <div style={{ width: "100%", height: "320px", position: "relative" }}>
      <canvas ref={chartRef} />
    </div>
  );
}
