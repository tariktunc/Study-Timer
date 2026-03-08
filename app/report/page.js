"use client";
import React, { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";
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

const TABS = {
  SUMMARY: "summary",
  DETAIL: "detail",
  RANKING: "ranking",
};

const PERIOD = {
  WEEK: "week",
  MONTH: "month",
  YEAR: "year",
};

export default function ReportPage() {
  const router = useRouter();
  const { sessions } = useSelector((state) => state.report);
  const { colorSettings } = useSelector((state) => state.colorSettings);
  const [activeTab, setActiveTab] = useState(TABS.SUMMARY);
  const [period, setPeriod] = useState(PERIOD.WEEK);
  const [periodOffset, setPeriodOffset] = useState(0);

  // Calculations
  const totalMinutes = sessions.reduce((t, s) => t + s.focusMinutes, 0);
  const totalHours = (totalMinutes / 60).toFixed(1);
  const daysAccessed = sessions.length;

  const dayStreak = useMemo(() => {
    if (sessions.length === 0) return 0;
    const dates = sessions.map((s) => s.date).sort().reverse();
    const today = new Date().toISOString().split("T")[0];
    let streak = 0;
    let checkDate = new Date(today);

    for (let i = 0; i < 365; i++) {
      const dateStr = checkDate.toISOString().split("T")[0];
      if (dates.includes(dateStr)) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        // Allow today to be missing (day not finished yet)
        if (i === 0) {
          checkDate.setDate(checkDate.getDate() - 1);
          continue;
        }
        break;
      }
    }
    return streak;
  }, [sessions]);

  // Period label & navigation
  const periodLabel = useMemo(() => {
    const today = new Date();
    if (period === PERIOD.WEEK) {
      const start = new Date(today);
      start.setDate(start.getDate() - start.getDay() + 1 + periodOffset * 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      if (periodOffset === 0) return "Bu Hafta";
      return `${start.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })} - ${end.toLocaleDateString("tr-TR", { day: "numeric", month: "short" })}`;
    } else if (period === PERIOD.MONTH) {
      const d = new Date(today.getFullYear(), today.getMonth() + periodOffset, 1);
      if (periodOffset === 0) return "Bu Ay";
      return d.toLocaleDateString("tr-TR", { month: "long", year: "numeric" });
    } else {
      const year = today.getFullYear() + periodOffset;
      if (periodOffset === 0) return "Bu Yıl";
      return `${year}`;
    }
  }, [period, periodOffset]);

  // Chart data based on period
  const chartData = useMemo(() => {
    const today = new Date();
    let labels = [];
    let data = [];

    if (period === PERIOD.WEEK) {
      const monday = new Date(today);
      monday.setDate(monday.getDate() - monday.getDay() + 1 + periodOffset * 7);
      const dayNames = ["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"];
      for (let d = 0; d < 7; d++) {
        const date = new Date(monday);
        date.setDate(date.getDate() + d);
        const dateStr = date.toISOString().split("T")[0];
        labels.push(dayNames[d]);
        const session = sessions.find((s) => s.date === dateStr);
        data.push(session ? +(session.focusMinutes / 60).toFixed(2) : 0);
      }
    } else if (period === PERIOD.MONTH) {
      const targetMonth = new Date(today.getFullYear(), today.getMonth() + periodOffset, 1);
      const daysInMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate();
      for (let d = 1; d <= daysInMonth; d++) {
        const date = new Date(targetMonth.getFullYear(), targetMonth.getMonth(), d);
        const dateStr = date.toISOString().split("T")[0];
        labels.push(`${d}`);
        const session = sessions.find((s) => s.date === dateStr);
        data.push(session ? +(session.focusMinutes / 60).toFixed(2) : 0);
      }
    } else {
      const targetYear = today.getFullYear() + periodOffset;
      const monthNames = ["Oca", "Şub", "Mar", "Nis", "May", "Haz", "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara"];
      for (let m = 0; m < 12; m++) {
        labels.push(monthNames[m]);
        let monthTotal = 0;
        sessions.forEach((s) => {
          const sDate = new Date(s.date);
          if (sDate.getFullYear() === targetYear && sDate.getMonth() === m) {
            monthTotal += s.focusMinutes;
          }
        });
        data.push(+(monthTotal / 60).toFixed(2));
      }
    }

    return {
      labels,
      datasets: [
        {
          label: "Odaklanma (saat)",
          data,
          backgroundColor: colorSettings.focusColor + "CC",
          borderRadius: 4,
          borderSkipped: false,
        },
      ],
    };
  }, [sessions, period, periodOffset, colorSettings]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(0,0,0,0.8)",
        callbacks: {
          label: (ctx) => `${ctx.raw} saat`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: "rgba(255,255,255,0.1)" },
        ticks: {
          color: "rgba(255,255,255,0.7)",
          callback: (v) => `${v}h`,
        },
      },
      x: {
        grid: { display: false },
        ticks: { color: "rgba(255,255,255,0.7)", font: { size: period === PERIOD.MONTH ? 9 : 12 } },
      },
    },
  };

  // Project / total table
  const totalTableHours = Math.floor(totalMinutes / 60);
  const totalTableMins = totalMinutes % 60;

  // Detail tab data
  const detailData = useMemo(() => {
    return [...sessions].sort((a, b) => b.date.localeCompare(a.date));
  }, [sessions]);

  // Ranking tab data
  const rankingData = useMemo(() => {
    return [...sessions]
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }, [sessions]);

  const styles = {
    page: {
      minHeight: "100vh",
      maxWidth: 520,
      margin: "0 auto",
      padding: "0 16px",
      color: "white",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid rgba(255,255,255,0.15)",
      marginBottom: 20,
    },
    title: {
      fontSize: 20,
      fontWeight: 700,
    },
    closeBtn: {
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: 4,
      opacity: 0.8,
    },
    tabs: {
      display: "flex",
      justifyContent: "center",
      gap: 0,
      marginBottom: 24,
      borderBottom: "1px solid rgba(255,255,255,0.15)",
    },
    tab: (active) => ({
      padding: "10px 24px",
      color: active ? "white" : "rgba(255,255,255,0.5)",
      fontWeight: 600,
      fontSize: 14,
      background: "none",
      border: "none",
      borderBottom: active ? "2px solid white" : "2px solid transparent",
      cursor: "pointer",
      transition: "all 0.2s",
    }),
    sectionTitle: {
      fontSize: 13,
      fontWeight: 700,
      color: "rgba(255,255,255,0.6)",
      textTransform: "uppercase",
      letterSpacing: "0.06em",
      marginBottom: 12,
    },
    statCards: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: 12,
      marginBottom: 28,
    },
    statCard: {
      backgroundColor: "rgba(255,255,255,0.1)",
      borderRadius: 12,
      padding: "20px 12px",
      textAlign: "center",
    },
    statIcon: {
      marginBottom: 6,
      opacity: 0.8,
    },
    statValue: {
      fontSize: 24,
      fontWeight: 800,
    },
    statLabel: {
      fontSize: 11,
      opacity: 0.7,
      marginTop: 2,
    },
    periodSelector: {
      display: "flex",
      justifyContent: "center",
      gap: 4,
      marginBottom: 12,
    },
    periodBtn: (active) => ({
      padding: "6px 16px",
      borderRadius: 6,
      backgroundColor: active ? "rgba(0,0,0,0.2)" : "transparent",
      color: "white",
      fontSize: 13,
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
    }),
    dateNav: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: 12,
      marginBottom: 16,
    },
    arrowBtn: {
      background: "none",
      border: "none",
      color: "white",
      cursor: "pointer",
      padding: 4,
      fontSize: 18,
      opacity: 0.7,
    },
    chartContainer: {
      backgroundColor: "rgba(255,255,255,0.06)",
      borderRadius: 12,
      padding: 20,
      height: 300,
      marginBottom: 28,
    },
    table: {
      width: "100%",
      marginBottom: 40,
    },
    tableHeader: {
      display: "flex",
      justifyContent: "space-between",
      padding: "8px 0",
      borderBottom: "1px solid rgba(255,255,255,0.15)",
      fontSize: 11,
      fontWeight: 700,
      color: "rgba(255,255,255,0.5)",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
    },
    tableRow: {
      display: "flex",
      justifyContent: "space-between",
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
      fontSize: 14,
    },
    detailItem: {
      backgroundColor: "rgba(255,255,255,0.06)",
      borderRadius: 8,
      padding: "14px 16px",
      marginBottom: 8,
    },
    detailDate: {
      fontSize: 13,
      fontWeight: 700,
      marginBottom: 4,
    },
    detailInfo: {
      fontSize: 12,
      opacity: 0.7,
    },
    rankRow: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid rgba(255,255,255,0.06)",
    },
    rankNumber: {
      width: 28,
      height: 28,
      borderRadius: "50%",
      backgroundColor: "rgba(255,255,255,0.1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 12,
      fontWeight: 700,
      flexShrink: 0,
    },
    empty: {
      textAlign: "center",
      padding: 40,
      opacity: 0.5,
      fontSize: 14,
    },
  };

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <span style={styles.title}>Rapor</span>
        <button style={styles.closeBtn} onClick={() => router.push("/")} aria-label="Kapat">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        {[
          { key: TABS.SUMMARY, label: "Özet" },
          { key: TABS.DETAIL, label: "Detay" },
          { key: TABS.RANKING, label: "Sıralama" },
        ].map((tab) => (
          <button
            key={tab.key}
            style={styles.tab(activeTab === tab.key)}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SUMMARY TAB */}
      {activeTab === TABS.SUMMARY && (
        <>
          <p style={styles.sectionTitle}>Aktivite Özeti</p>
          <div style={styles.statCards}>
            {/* Hours Focused */}
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                  <path d="M12 7v5l3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={styles.statValue}>{totalHours}</p>
              <p style={styles.statLabel}>Odaklanma Saati</p>
            </div>
            {/* Days Accessed */}
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M16 2v4M8 2v4M3 10h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p style={styles.statValue}>{daysAccessed}</p>
              <p style={styles.statLabel}>Erişilen Gün</p>
            </div>
            {/* Day Streak */}
            <div style={styles.statCard}>
              <div style={styles.statIcon}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2c0 4-4 6-4 10a4 4 0 008 0c0-4-4-6-4-10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                </svg>
              </div>
              <p style={styles.statValue}>{dayStreak}</p>
              <p style={styles.statLabel}>Gün Serisi</p>
            </div>
          </div>

          {/* Focus Hours Section */}
          <p style={styles.sectionTitle}>Odaklanma Saatleri</p>

          {/* Period selector */}
          <div style={styles.periodSelector}>
            {[
              { key: PERIOD.WEEK, label: "Hafta" },
              { key: PERIOD.MONTH, label: "Ay" },
              { key: PERIOD.YEAR, label: "Yıl" },
            ].map((p) => (
              <button
                key={p.key}
                style={styles.periodBtn(period === p.key)}
                onClick={() => { setPeriod(p.key); setPeriodOffset(0); }}
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Date navigation */}
          <div style={styles.dateNav}>
            <button style={styles.arrowBtn} onClick={() => setPeriodOffset((o) => o - 1)} aria-label="Önceki">
              &#8249;
            </button>
            <span style={{ fontSize: 14, fontWeight: 600 }}>{periodLabel}</span>
            <button
              style={{ ...styles.arrowBtn, opacity: periodOffset >= 0 ? 0.3 : 0.7 }}
              onClick={() => { if (periodOffset < 0) setPeriodOffset((o) => o + 1); }}
              disabled={periodOffset >= 0}
              aria-label="Sonraki"
            >
              &#8250;
            </button>
          </div>

          {/* Chart */}
          <div style={styles.chartContainer}>
            {sessions.length > 0 ? (
              <Bar data={chartData} options={chartOptions} />
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", opacity: 0.5 }}>
                <p>Henüz veri yok. Pomodoro tamamlayarak başlayın!</p>
              </div>
            )}
          </div>

          {/* Project Table */}
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>PROJE</span>
              <span>SÜRE (SS:DD)</span>
            </div>
            <div style={{ ...styles.tableRow, fontWeight: 700 }}>
              <span>Toplam</span>
              <span>{String(totalTableHours).padStart(2, "0")}:{String(totalTableMins).padStart(2, "0")}</span>
            </div>
          </div>
        </>
      )}

      {/* DETAIL TAB */}
      {activeTab === TABS.DETAIL && (
        <div style={{ marginBottom: 40 }}>
          {detailData.length === 0 ? (
            <p style={styles.empty}>Henüz kayıt yok.</p>
          ) : (
            detailData.map((s) => {
              const h = Math.floor(s.focusMinutes / 60);
              const m = s.focusMinutes % 60;
              const dateObj = new Date(s.date);
              const dateLabel = dateObj.toLocaleDateString("tr-TR", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              });
              return (
                <div key={s.date} style={styles.detailItem}>
                  <p style={styles.detailDate}>{dateLabel}</p>
                  <p style={styles.detailInfo}>
                    {s.count} pomodoro &middot; {h > 0 ? `${h}s ${m}dk` : `${m}dk`} odaklanma
                  </p>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* RANKING TAB */}
      {activeTab === TABS.RANKING && (
        <div style={{ marginBottom: 40 }}>
          <p style={styles.sectionTitle}>Pomodoro Sıralaması (Güne Göre)</p>
          {rankingData.length === 0 ? (
            <p style={styles.empty}>Henüz kayıt yok.</p>
          ) : (
            rankingData.map((s, i) => {
              const dateObj = new Date(s.date);
              const dateLabel = dateObj.toLocaleDateString("tr-TR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              });
              return (
                <div key={s.date} style={styles.rankRow}>
                  <div style={styles.rankNumber}>{i + 1}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 600 }}>{dateLabel}</p>
                    <p style={{ fontSize: 12, opacity: 0.6 }}>
                      {s.count} pomodoro &middot; {Math.floor(s.focusMinutes / 60)}s {s.focusMinutes % 60}dk
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
