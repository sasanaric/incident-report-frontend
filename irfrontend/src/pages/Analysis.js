import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Analysis = () => {
  const data = [
    { name: "Category 1", uv: 4000, pv: 2400, amt: 2400 },
    { name: "Category 2", uv: 3000, pv: 1398, amt: 2210 },
    { name: "Category 3", uv: 2000, pv: 9800, amt: 2290 },
    // ... other data points
  ];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="uv" fill="#8884d8" />
        <Bar dataKey="pv" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default Analysis;
