import Head from 'next/head';
import SearchBar from '../components/SearchBar';
import '../styles/globals.css'

export default function Home() {
  return (
    <>
      <Head>
        <title>SearchSphere</title>
      </Head>
      <main className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-50 to-purple-300 slow-pulse">
        <div className="w-96 h-96 md:w-156 md:h-156 rounded-full bg-gradient-to-r from-purple-600 to-purple-800 shadow-2xl flex flex-col items-center justify-center p-6">
          <h1 className="text-white text-3xl md:text-5xl font-semibold mb-4">SearchSphere</h1>
          <p className="text-gray-50 text-medium md:text-lg mb-6 text-center">Type a query, hit search and see the magic!</p>
          <SearchBar />
        </div>
      </main>
    </>
  );
}