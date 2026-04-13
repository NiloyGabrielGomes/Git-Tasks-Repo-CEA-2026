import { usePokemonListRQ } from '../hooks/usePokemonListRQ';
import { ListContent } from './ListContent';

type Props = { searchQuery: string };

export function ReactQueryList({ searchQuery }: Props) {
  const result = usePokemonListRQ(searchQuery);
  return <ListContent {...result} searchQuery={searchQuery} />;
}
