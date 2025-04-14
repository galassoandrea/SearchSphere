import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';

type SearchResult = {
  title: string;
  content: string;
  score: number;
};

export default function ResultsPage() {
  const router = useRouter();
  const { q } = router.query;
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!q || typeof q !== "string") return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: q }),
        });

        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  return (
    <>
      <Head>
        <title>SearchSphere - Results</title>
      </Head>
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
        <h1 className="text-3xl font-bold text-purple-700 mt-8 mb-4">
          Results for: <span className="text-black italic">{q}</span>
        </h1>

        {loading ? (
          <p className="text-gray-500">Searching...</p>
        ) : results.length === 0 ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <div className="w-full max-w-2xl space-y-4">
            {results.map((result, index) => (
              <div
                key={index}
                className="bg-white p-4 rounded-lg shadow-md transition hover:shadow-lg"
              >
                <h2 className="text-lg font-semibold text-purple-600">{result.title}</h2>
                <p className="text-gray-600">{result.content}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </>
  );
}