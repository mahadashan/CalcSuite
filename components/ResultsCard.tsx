interface ResultsCardProps {
  results: { label: string; value: string; highlight?: boolean; sub?: string }[];
}

export function ResultsCard({ results }: ResultsCardProps) {
  return (
    <div
      className="rounded-2xl p-6 animate-fade-in-up"
      style={{
        background: "linear-gradient(135deg, rgba(0,208,132,0.08) 0%, rgba(59,130,246,0.06) 100%)",
        border: "1px solid rgba(0,208,132,0.2)",
      }}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((r, i) => (
          <div
            key={i}
            className="rounded-xl p-4 transition-all duration-200 hover:scale-[1.02]"
            style={{
              background: r.highlight
                ? "rgba(0,208,132,0.12)"
                : "rgba(10,22,40,0.6)",
              border: r.highlight
                ? "1px solid rgba(0,208,132,0.3)"
                : "1px solid rgba(30,58,112,0.3)",
            }}
          >
            <div className="text-xs font-medium uppercase tracking-wider mb-1" style={{ color: "#6b7280" }}>
              {r.label}
            </div>
            <div
              className="text-2xl font-bold result-value"
              style={{ color: r.highlight ? "#00d084" : "#f9fafb" }}
            >
              {r.value}
            </div>
            {r.sub && (
              <div className="text-xs mt-0.5" style={{ color: "#6b7280" }}>{r.sub}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
