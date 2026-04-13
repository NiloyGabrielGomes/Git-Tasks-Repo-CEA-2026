import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
import { DetailPage } from './pages/DetailPage';
import type { Source } from './components/DataSourceToggle';

function App() {
  const [source, setSource] = useState<Source>('react-query');

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<ListPage source={source} onSourceChange={setSource} />} />
        <Route path="/item/:id" element={<DetailPage />} />
      </Routes>
    </div>
  );
}

export default App;