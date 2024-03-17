export function Loading() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-1" data-testid="loading">
      <p className="text-slate-400 font-semibold animate-pulse">
        Carregando...
      </p>
    </div>
  )
}