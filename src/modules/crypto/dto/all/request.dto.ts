export class GetAllCoinsRequest {
  page: string;
  limit: string;
  sort: 'sortByName' | 'sortByTier' | 'sortByRank' | 'sortByCap';
}
