import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#1a1c20] text-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Welcome to Charlie Application</h1>
        <Link
          href="/dashboard"
          className="inline-block bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
        >
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}

