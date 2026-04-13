import { useState } from 'react';
import { SearchBar } from '../components/SearchBar';
import { DataSourceToggle } from '../components/DataSourceToggle';
import { RawFetchList } from '../components/RawFetchList';
import { ReactQueryList } from '../components/ReactQueryList';
import type { Source } from '../components/DataSourceToggle';

type Props = {
  source: Source;
  onSourceChange: (source: Source) => void;
};

function ListPage({ source, onSourceChange }: Props) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-8">Pokédex</h1>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      <DataSourceToggle value={source} onChange={onSourceChange} />
      {source === 'raw'
        ? <RawFetchList searchQuery={searchQuery} />
        : <ReactQueryList searchQuery={searchQuery} />}
    </div>
  );
}

export default ListPage;
