import { Routes, Route } from 'react-router-dom';
import ListPage from './pages/ListPage';
//import DetailPage from './pages/DetailPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<ListPage />} />
        {/* <Route path="/item/:id" element={<DetailPage />} /> */}
      </Routes>
    </div>
  );
}

export default App;