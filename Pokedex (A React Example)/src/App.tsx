import './App.css'
import { usePokemonList } from './hooks/usePokemonList';

function App() {
  const state = usePokemonList();

  if (state.status === 'loading') return <div className="p-8">Loading...</div>;
  if (state.status === 'error') return <div className="p-8 text-red-600">Error: {state.error}</div>;
  if (state.status === 'empty') return <div className="p-8">No results</div>;
  
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Pokémon ({state.data.length})</h1>
      <ul>
        {state.data.slice(0, 10).map(p => (
          <li key={p.id}>{p.name} — {p.types.join(', ')}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
