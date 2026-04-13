export type Source = 'raw' | 'react-query';

type Props = {
  value: Source;
  onChange: (source: Source) => void;
};

export function DataSourceToggle({ value, onChange }: Props) {
  return (
    <div className="flex justify-center mb-6">
      <div className="inline-flex rounded-lg border border-gray-300 overflow-hidden">
        {(['raw', 'react-query'] as Source[]).map(source => (
          <button
            key={source}
            onClick={() => onChange(source)}
            className={`px-5 py-2 text-sm font-medium transition-colors ${
              value === source
                ? 'bg-blue-500 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            {source === 'raw' ? 'Raw Fetch' : 'React Query'}
          </button>
        ))}
      </div>
    </div>
  );
}
