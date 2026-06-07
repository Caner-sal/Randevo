"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const data = [
  { name: "Pzt", completed: 12, cancelled: 2 },
  { name: "Sal", completed: 18, cancelled: 1 },
  { name: "Çar", completed: 15, cancelled: 3 },
  { name: "Per", completed: 22, cancelled: 0 },
  { name: "Cum", completed: 25, cancelled: 4 },
  { name: "Cmt", completed: 30, cancelled: 5 },
  { name: "Paz", completed: 8, cancelled: 1 },
];

export function AppointmentsChart() {
  return (
    <div style={{ height: 300, width: "100%" }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          />
          <Tooltip 
            contentStyle={{ backgroundColor: "var(--color-card)", borderColor: "var(--color-border)", borderRadius: 8, color: "var(--color-foreground)" }} 
            cursor={{ fill: "var(--color-muted)", opacity: 0.2 }}
          />
          <Bar dataKey="completed" name="Tamamlanan" fill="#2de4a4" radius={[4, 4, 0, 0]} />
          <Bar dataKey="cancelled" name="İptal Edilen" fill="#f43f5e" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
