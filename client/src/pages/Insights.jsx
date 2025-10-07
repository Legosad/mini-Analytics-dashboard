import React, { useEffect, useState } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { InsightsAPI } from "../api/insights";

const ord = (n) => {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export default function Insights() {
  const [days, setDays] = useState(7);
  const [data, setData] = useState(null);
  const [topPosts, setTopPosts] = useState([]);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const [ov, tp] = await Promise.all([
          InsightsAPI.overview(days),
          InsightsAPI.topPosts(5),
        ]);
        setData(ov.data);
        setTopPosts(tp.data || []);
        setErr("");
      } catch (e) {
        setErr(e.message);
      }
    })();
  }, [days]);

  if (err)
    return (
      <div className="container">
        <p style={{ color: "crimson" }}>{err}</p>
      </div>
    );
  if (!data)
    return (
      <div className="container">
        <p>Loading…</p>
      </div>
    );

  // Bar chart data: MM-DD labels + counts
  const barData = (data.timeseries.posts || []).map((d) => ({
    date: d.date.slice(5),
    count: d.count,
  }));

  const topAuthors = (data.leaders.authors || []).slice(0, 5);

  return (
    <div className="container">
      <h4>Insights (last {days} days)</h4>

      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <select value={days} onChange={(e) => setDays(Number(e.target.value))}>
          <option value={7}>7</option>
          <option value={14}>14</option>
          <option value={30}>30</option>
        </select>
        <div>
          Totals — Posts: <b>{data.totals.posts}</b>, Comments:{" "}
          <b>{data.totals.comments}</b>
        </div>
      </div>

      {/* 1) Daily Posts — Bar Chart */}
      <div style={{ marginTop: 16 }} className="card">
        <h5>Daily Posts</h5>
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer>
            <BarChart
              data={barData}
              margin={{ top: 10, right: 20, bottom: 0, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" name="Posts" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        style={{ display: "flex", gap: 24, marginTop: 16, flexWrap: "wrap" }}
      >
        {/* 2) Top 5 Most Commented Posts — Table */}
        <div className="card" style={{ flex: "1 1 420px" }}>
          <h5>Top 5 Most Commented Posts</h5>
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Rank</th>
                <th>Title</th>
                <th>Author</th>
                <th style={{ textAlign: "right" }}>Comments</th>
              </tr>
            </thead>
            <tbody>
              {topPosts.length ? (
                topPosts.map((p, i) => (
                  <tr key={p.postId || p.title + i}>
                    <td>{ord(i + 1)}</td>
                    <td>{p.title}</td>
                    <td>{p.author}</td>
                    <td style={{ textAlign: "right" }}>{p.commentCount}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    <em>No data yet.</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* 3) Top Authors by Posts — Table */}
        <div className="card" style={{ flex: "1 1 420px" }}>
          <h5>Top Authors by Posts</h5>
          <table>
            <thead>
              <tr>
                <th style={{ width: 80 }}>Rank</th>
                <th>Author</th>
                <th style={{ textAlign: "right" }}>Posts</th>
              </tr>
            </thead>
            <tbody>
              {topAuthors.length ? (
                topAuthors.map((a, i) => (
                  <tr key={a.author || a._id || i}>
                    <td>{ord(i + 1)}</td>
                    <td>{a.author || a._id}</td>
                    <td style={{ textAlign: "right" }}>{a.posts || a.count}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={3}>
                    <em>No data yet.</em>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
