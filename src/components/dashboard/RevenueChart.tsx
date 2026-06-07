"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Oca", total: 1200 },
  { name: "Şub", total: 2100 },
  { name: "Mar", total: 1800 },
  { name: "Nis", total: 2800 },
  { name: "May", total: 3200 },
  { name: "Haz", total: 3800 },
  { name: "Tem", total: 4100 },
];

export function RevenueChart() {
  return (
    <div style={{ height: 300, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#7768d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#7768d4" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="name" 
            stroke="var(--color-muted-foreground)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
          />
          <YAxis 
            stroke="var(--color-muted-foreground)" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(value) => `₺${value}`} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: 8, color: "var(--color-foreground)" }} 
            itemStyle={{ color: "var(--color-primary)" }}
          />
          <Area type="monotone" dataKey="total" stroke="#7768d4" strokeWidth={3} fillOpacity={1} fill="url(#colorTotal)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
