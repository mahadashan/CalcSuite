"use client";

import { useState, useMemo } from "react";
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight } from "lucide-react";

export interface AmortRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

interface AmortizationTableProps {
  rows: AmortRow[];
  pageSize?: number;
}

type SortKey = keyof AmortRow;

const fmt = (v: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

export function AmortizationTable({ rows, pageSize = 12 }: AmortizationTableProps) {
  const [page, setPage] = useState(0);
  const [sortKey, setSortKey] = useState<SortKey>("month");
  const [sortAsc, setSortAsc] = useState(true);

  const sorted = useMemo(() => {
    return [...rows].sort((a, b) =>
      sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]
    );
  }, [rows, sortKey, sortAsc]);

  const totalPages = Math.ceil(sorted.length / pageSize);
  const pageRows = sorted.slice(page * pageSize, (page + 1) * pageSize);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else { setSortKey(key); setSortAsc(true); }
    setPage(0);
  };

  const SortIcon = ({ k }: { k: SortKey }) =>
    sortKey === k ? (
      sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />
    ) : null;

  const cols: { key: SortKey; label: string }[] = [
    { key: "month", label: "Month" },
    { key: "payment", label: "Payment" },
    { key: "principal", label: "Principal" },
    { key: "interest", label: "Interest" },
    { key: "balance", label: "Balance" },
  ];

  if (rows.length === 0) return null;

  return (
    <div className="mt-6">
      <h3 className="text-lg font-bold text-white mb-3">Amortization Schedule</h3>
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid rgba(30,58,112,0.3)" }}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ background: "rgba(15,32,66,0.9)" }}>
                {cols.map((col) => (
                  <th
                    key={col.key}
                    className="px-4 py-3 text-left font-semibold cursor-pointer select-none transition-colors hover:text-white"
                    style={{ color: "#9ca3af", borderBottom: "1px solid rgba(30,58,112,0.4)" }}
                    onClick={() => handleSort(col.key)}
                  >
                    <div className="flex items-center gap-1">
                      {col.label}
                      <SortIcon k={col.key} />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pageRows.map((row) => (
                <tr key={row.month} className="amort-row transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{row.month}</td>
                  <td className="px-4 py-3" style={{ color: "#d1d5db" }}>{fmt(row.payment)}</td>
                  <td className="px-4 py-3" style={{ color: "#00d084" }}>{fmt(row.principal)}</td>
                  <td className="px-4 py-3" style={{ color: "#f87171" }}>{fmt(row.interest)}</td>
                  <td className="px-4 py-3" style={{ color: "#9ca3af" }}>{fmt(row.balance)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderTop: "1px solid rgba(30,58,112,0.3)", background: "rgba(10,22,40,0.6)" }}
          >
            <span className="text-xs" style={{ color: "#6b7280" }}>
              Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, rows.length)} of {rows.length} months
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-lg disabled:opacity-30 transition-opacity"
                style={{ color: "#9ca3af", background: "rgba(30,58,112,0.3)" }}
              >
                <ChevronLeft size={14} />
              </button>
              <span className="text-xs text-white px-2">
                {page + 1} / {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page === totalPages - 1}
                className="p-1.5 rounded-lg disabled:opacity-30 transition-opacity"
                style={{ color: "#9ca3af", background: "rgba(30,58,112,0.3)" }}
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
