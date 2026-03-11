"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color: string;
    fill?: boolean;
  }[];
}

interface FinancialChartProps {
  type?: "line" | "bar";
  data: ChartData;
  title?: string;
  yPrefix?: string;
}

export function FinancialChart({ type = "line", data, title, yPrefix = "$" }: FinancialChartProps) {
  const chartData = {
    labels: data.labels,
    datasets: data.datasets.map((ds) => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor:
        type === "bar"
          ? ds.color + "99"
          : ds.fill
            ? ds.color + "22"
            : ds.color + "00",
      borderWidth: type === "line" ? 2 : 0,
      fill: ds.fill ?? false,
      tension: 0.4,
      pointRadius: data.labels.length > 60 ? 0 : 3,
      pointHoverRadius: 5,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 2.2,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          color: "#9ca3af",
          font: { size: 12, family: "Inter" },
          usePointStyle: true,
          pointStyleWidth: 8,
        },
      },
      title: {
        display: !!title,
        text: title ?? "",
        color: "#d1d5db",
        font: { size: 14, weight: "600" as const, family: "Inter" },
        padding: { bottom: 16 },
      },
      tooltip: {
        backgroundColor: "rgba(10,22,40,0.95)",
        borderColor: "rgba(30,58,112,0.6)",
        borderWidth: 1,
        titleColor: "#f9fafb",
        bodyColor: "#9ca3af",
        padding: 12,
        callbacks: {
          label: (ctx: { dataset: { label: string }; parsed: { y: number } }) => {
            const val = ctx.parsed.y;
            const formatted = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: "USD",
              maximumFractionDigits: 0,
            }).format(val);
            return `${ctx.dataset.label}: ${formatted}`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: { color: "rgba(30,58,112,0.2)" },
        ticks: {
          color: "#6b7280",
          font: { size: 11, family: "Inter" },
          maxTicksLimit: 12,
        },
      },
      y: {
        grid: { color: "rgba(30,58,112,0.2)" },
        ticks: {
          color: "#6b7280",
          font: { size: 11, family: "Inter" },
          callback: (val: string | number) =>
            `${yPrefix}${new Intl.NumberFormat("en-US", { notation: "compact" }).format(Number(val))}`,
        },
      },
    },
  };

  return (
    <div
      className="rounded-2xl p-5 w-full"
      style={{ background: "rgba(10,22,40,0.6)", border: "1px solid rgba(30,58,112,0.3)" }}
    >
      {type === "line" ? (
        // @ts-expect-error - ChartJS typings clash with react-chartjs-2
        <Line data={chartData} options={options} />
      ) : (
        // @ts-expect-error - ChartJS typings clash with react-chartjs-2
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
}
