export function Error() {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full gap-1" data-testid="error">
      <h1 className="text-xl text-slate-100 font-bold">
        Não há itens para construir a árvore!
      </h1>
      <p className="text-slate-400 font-semibold">
        Não foi possível construir a árvore. Por favor, recarregue a página e tente novamente.
      </p>
    </div>
  )
}