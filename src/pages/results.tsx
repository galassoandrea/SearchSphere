import { useRouter } from 'next/router';
import Head from 'next/head';

export default function ResultsPage() {
  const router = useRouter();
  const { q } = router.query;

  return (
    <>
      <Head>
        <title>SearchSphere - Results</title>
      </Head>
      <main className="min-h-screen bg-gray-50 flex flex-col items-center justify-start p-6">
        <h1 className="text-3xl font-bold text-purple-700 mt-8 mb-4">
          Results for: <span className="text-black italic">{q}</span>
        </h1>
        <p className="text-gray-500 mb-8">This is where your search results will appear.</p>

        <div className="w-full max-w-2xl space-y-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-purple-600">Sample Result Title</h2>
            <p className="text-gray-600">This is a placeholder result description for "{q}".</p>
          </div>

          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-purple-600">Another Result</h2>
            <p className="text-gray-600">I will later replace this with real AI-powered results.</p>
          </div>
        </div>
      </main>
    </>
  );
}