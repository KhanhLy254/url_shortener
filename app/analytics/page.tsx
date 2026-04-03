"use client";

import { useState } from "react";

export default function AnalyticsPage() {
  const [shortUrl, setShortUrl] = useState("");
  const [result, setResult] = useState<null | {
    originalUrl: string;
    clicks: number;
  }>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCheck = async () => {
    try {
      setLoading(true);
      setError("");
      setResult(null);

      // lấy code từ URL
      const code = shortUrl.split("/").pop();

      const res = await fetch(`/api/stats/${code}`);
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">URL Analytics</h1>

      <input
        type="text"
        placeholder="Paste short URL here..."
        value={shortUrl}
        onChange={(e) => setShortUrl(e.target.value)}
        className="w-full px-4 py-3 border rounded-xl"
      />

      <button
        onClick={handleCheck}
        className="w-full bg-indigo-500 text-white py-3 rounded-xl"
      >
        {loading ? "Loading..." : "Show Click Count"}
      </button>

      {error && <p className="text-red-500">{error}</p>}

      {result && (
        <div className="p-4 border rounded-xl bg-slate-50">
          <p><strong>Original URL:</strong> {result.originalUrl}</p>
          <p><strong>Clicks:</strong> {result.clicks}</p>
        </div>
      )}
    </main>
  );
}