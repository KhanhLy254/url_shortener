"use client";

import { useState } from "react";
import { Copy, Check, Loader2, Link2 } from "lucide-react";

type HistoryItem = {
  original: string;
  short: string;
};

export default function HomePage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const isValidUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleShorten = async () => {
    setError("");
    setShortUrl("");

    if (!url) {
      setError("Please enter a URL");
      return;
    }

    if (!isValidUrl(url)) {
      setError("Invalid URL format");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Something went wrong");
      }

      setShortUrl(data.shortUrl);

      setHistory((prev) => [
        { original: url, short: data.shortUrl },
        ...prev,
      ]);

      setUrl("");
    } catch (err: any) {
      setError(err.message || "Error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);

    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <main className="min-h-screen bg-slate-50 flex flex-col items-center px-4 py-12">
      <div className="text-center max-w-2xl mb-10">
        <div className="flex justify-center mb-4">
          <div className="bg-indigo-100 p-3 rounded-xl">
            <Link2 className="text-indigo-600" size={28} />
          </div>
        </div>

        <h1 className="text-4xl font-bold text-slate-900">
          Shorten Your Long Links
        </h1>
        <p className="text-slate-600 mt-3">
          Paste a long URL and get a short, shareable link instantly.
        </p>
      </div>

      <div className="w-full max-w-xl bg-white rounded-2xl shadow-md p-6">
        <div className="flex flex-col gap-3">
          <input
            type="text"
            placeholder="Paste your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            onClick={handleShorten}
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white py-3 rounded-xl hover:bg-indigo-700 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Shortening...
              </>
            ) : (
              "Shorten"
            )}
          </button>
        </div>

        {shortUrl && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="text-indigo-600 font-medium truncate">
              {shortUrl}
            </span>

            <button
              onClick={() => handleCopy(shortUrl)}
              className="ml-4 flex items-center gap-1 text-sm px-3 py-1.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              {copied ? (
                <>
                  <Check size={16} />
                  Copied
                </>
              ) : (
                <>
                  <Copy size={16} />
                  Copy
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="w-full max-w-xl mt-8">
          <h2 className="text-lg font-semibold text-slate-800 mb-3">
            Recent Links
          </h2>

          <div className="bg-white rounded-2xl shadow-md overflow-hidden">
            {history.map((item, index) => (
              <div
                key={index}
                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b last:border-none"
              >
                <div className="mb-2 sm:mb-0">
                  <p className="text-sm text-slate-500 truncate max-w-xs">
                    {item.original}
                  </p>
                  <p className="text-indigo-600 font-medium">
                    {item.short}
                  </p>
                </div>

                <button
                  onClick={() => handleCopy(item.short)}
                  className="flex items-center gap-1 text-sm px-3 py-1.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
                >
                  {copied ? (
                    <>
                      <Check size={16} />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      Copy
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}