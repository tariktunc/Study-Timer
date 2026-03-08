"use client";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const VIEWS = {
  DAILY: "daily",
  WEEKLY: "weekly",
  MONTHLY: "monthly",
};

export default function ReportPage() {
  const { sessions } = useSelector((state) => state.report);
  const { colorSettings } = useSelector((state) => state.colorSettings);
  const [view, setView] = useState(VIEWS.WEEKLY);

  const chartData = useMemo(() => {
    const today = new Date();
    let labels = [];
    let data = [];

    if (view === VIEWS.DAILY) {
      // Last 7 days
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split("T")[0];
        const dayName = date.toLocaleDateString("tr-TR", { weekday: "short" });
        labels.push(dayName);
        const session = sessions.find((s) => s.date === dateStr);
        data.push(session ? session.focusMinutes : 0);
      }
    } else if (view === VIEWS.WEEKLY) {
      // Last 4 weeks
      for (let w = 3; w >= 0; w--) {
        let weekTotal = 0;
        const weekStart = new Date(today);
        weekStart.setDate(weekStart.getDate() - (w * 7 + today.getDay()));

        for (let d = 0; d < 7; d++) {
          const date = new Date(weekStart);
          date.setDate(date.getDate() + d);
          const dateStr = date.toISOString().split("T")[0];
          const session = sessions.find((s) => s.date === dateStr);
          if (session) weekTotal += session.focusMinutes;
        }

        labels.push(`Hafta ${4 - w}`);
        data.push(weekTotal);
      }
    } else {
      // Last 12 months
      for (let m = 11; m >= 0; m--) {
        const date = new Date(today.getFullYear(), today.getMonth() - m, 1);
        const monthName = date.toLocaleDateString("tr-TR", { month: "short" });
        const year = date.getFullYear();
        const month = date.getMonth();

        let monthTotal = 0;
        sessions.forEach((s) => {
          const sDate = new Date(s.date);
          if (sDate.getFullYear() === year && sDate.getMonth() === month) {
            monthTotal += s.focusMinutes;
          }
        });

        labels.push(monthName);
        data.push(monthTotal);
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Odaklanma Süresi (dk)",
          data,
          backgroundColor: colorSettings.focusColor + "CC",
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };
  }, [sessions, view, colorSettings]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        titleFont: { size: 14, weight: "bold" },
        bodyFont: { size: 13 },
        callbacks: {
          label: (ctx) => {
            const hours = Math.floor(ctx.raw / 60);
            const mins = ctx.raw % 60;
            return hours > 0 ? `${hours}s ${mins}dk` : `${mins}dk`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: { color: "rgba(255,255,255,0.7)", font: { weight: "bold" } },
      },
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.7)", font: { weight: "bold" } },
      },
    },
  };

  const totalPomos = sessions.reduce((t, s) => t + s.count, 0);
  const totalMinutes = sessions.reduce((t, s) => t + s.focusMinutes, 0);
  const totalHours = Math.floor(totalMinutes / 60);

  const downloadCSV = () => {
    if (sessions.length === 0) return;
    const header = "Tarih,Pomodoro Sayısı,Odaklanma Süresi (dk)\n";
    const rows = sessions.map((s) => `${s.date},${s.count},${s.focusMinutes}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "studytimer-rapor.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col items-center min-h-screen">
      {/* Header */}
      <nav
        style={{
          width: "100%",
          maxWidth: "var(--max-width)",
          padding: "var(--space-3) 0",
          marginBottom: "var(--space-4)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Link
          href="/"
          style={{
            color: "white",
            textDecoration: "none",
            fontSize: "var(--font-size-xl)",
            fontWeight: 800,
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Rapor
        </Link>
        <button
          onClick={downloadCSV}
          style={{
            padding: "var(--space-2) var(--space-3)",
            backgroundColor: "rgba(255,255,255,0.2)",
            borderRadius: "var(--radius-sm)",
            fontSize: "var(--font-size-sm)",
            color: "white",
          }}
          aria-label="CSV olarak indir"
        >
          CSV İndir
        </button>
      </nav>

      <main className="container-main">
        {/* Summary Cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "var(--space-3)",
            marginBottom: "var(--space-6)",
          }}
        >
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800 }}>{totalPomos}</p>
            <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>Toplam Pomodoro</p>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800 }}>{totalHours}</p>
            <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>Toplam Saat</p>
          </div>
          <div
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "var(--radius-lg)",
              padding: "var(--space-5)",
              textAlign: "center",
            }}
          >
            <p style={{ fontSize: "var(--font-size-2xl)", fontWeight: 800 }}>{sessions.length}</p>
            <p style={{ fontSize: "var(--font-size-sm)", opacity: 0.8 }}>Aktif Gün</p>
          </div>
        </div>

        {/* View Selector */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "var(--space-2)",
            marginBottom: "var(--space-5)",
          }}
        >
          {[
            { key: VIEWS.DAILY, label: "Günlük" },
            { key: VIEWS.WEEKLY, label: "Haftalık" },
            { key: VIEWS.MONTHLY, label: "Aylık" },
          ].map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              style={{
                padding: "var(--space-2) var(--space-4)",
                borderRadius: "var(--radius-sm)",
                backgroundColor: view === v.key ? "rgba(0,0,0,0.15)" : "transparent",
                color: "white",
                fontSize: "var(--font-size-sm)",
                fontWeight: 700,
              }}
            >
              {v.label}
            </button>
          ))}
        </div>

        {/* Chart */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "var(--radius-lg)",
            padding: "var(--space-5)",
            height: "350px",
          }}
        >
          {sessions.length > 0 ? (
            <Bar data={chartData} options={chartOptions} />
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                opacity: 0.6,
              }}
            >
              <p>Henüz veri yok. Pomodoro tamamlayarak başlayın!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
