import { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ResultsPage() {
  const router = useRouter();
  const { q } = router.query;
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch the results from the search API (if any) every time the query changes
  useEffect(() => {
    if (!q || typeof q !== "string") return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          method: "GET",
        });

        const data = await response.json();

        // Update state variables with the fetched data
        setAnswer(data.answer || '');
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
        ) : answer === '' ? (
          <p className="text-gray-500">No results found.</p>
        ) : (
          <div className="w-full max-w-2xl space-y-6 bg-white p-6 mt-10 rounded-lg shadow-md border-l-4 border-purple-500">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Generated Answer</h2>
            <p className="text-gray-700 whitespace-pre-line">{answer}</p>
          </div>
        )}
      </main>
    </>
  );
}