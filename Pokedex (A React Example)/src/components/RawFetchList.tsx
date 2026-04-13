import { usePokemonList } from '../hooks/usePokemonList';
import { ListContent } from './ListContent';

type Props = { searchQuery: string };

export function RawFetchList({ searchQuery }: Props) {
  const result = usePokemonList(searchQuery);
  return <ListContent {...result} searchQuery={searchQuery} />;
}
