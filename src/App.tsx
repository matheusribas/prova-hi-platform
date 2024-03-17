import { Tree } from './components/Tree'
import { NodeProvider } from './context/Nodes'

function App() {
  return (
    <div className="h-screen w-full bg-slate-950 flex justify-center items-center text-slate-50">
      <div className="bg-slate-800 flex flex-col w-full max-w-[800px] h-full max-h-[500px] rounded p-4 m-4">
        <NodeProvider>
          <Tree />
        </NodeProvider>
      </div>
    </div>
  )
}

export default App
