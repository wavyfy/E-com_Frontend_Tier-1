"use client";

type DistributionItem = {
  _id: number; // rating value (1–5)
  count: number;
};

export default function RatingDistribution({
  total,
  distribution,
  barColor = "#fff",
}: {
  total: number;
  distribution: DistributionItem[];
  barColor?: string; // admin can pass different color
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {[5, 4, 3, 2, 1].map((rating) => {
        const found = distribution.find((d) => d._id === rating);
        const count = found?.count ?? 0;
        const percent = total ? Math.round((count / total) * 100) : 0;

        return (
          <div
            key={rating}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <span style={{ width: 28 }}>{rating}★</span>

            <div
              style={{
                flex: 1,
                background: "#444",
                height: 6,
                borderRadius: 3,
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  width: `${percent}%`,
                  background: barColor,
                  height: "100%",
                }}
              />
            </div>

            <span style={{ width: 28, textAlign: "right" }}>{count}</span>
          </div>
        );
      })}
    </div>
  );
}
