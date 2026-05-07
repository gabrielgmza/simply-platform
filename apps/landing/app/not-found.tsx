import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white grid place-items-center px-6">
      <div className="text-center max-w-md">
        <div className="text-blue-500 text-7xl font-bold tracking-tight">404</div>
        <h1 className="mt-4 text-3xl font-semibold">Página no encontrada</h1>
        <p className="mt-3 text-zinc-400">La página que buscás no existe o fue movida.</p>
        <Link href="/" className="mt-8 inline-block bg-blue-600 hover:bg-blue-500 px-6 py-3 rounded-2xl font-semibold transition">
          ← Volver al inicio
        </Link>
      </div>
    </main>
  );
}
