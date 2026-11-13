export default function Loading() {
  return (
    <div className="mx-auto max-w-6xl animate-pulse pt-4" aria-busy="true" aria-label="Carregando">
      <div className="bg-line h-9 w-64 rounded-xl" />
      <div className="bg-line/70 mt-3 h-5 w-96 max-w-full rounded-lg" />
      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-36 rounded-3xl bg-white" />
        ))}
      </div>
      <div className="mt-6 h-72 rounded-3xl bg-white" />
    </div>
  );
}
