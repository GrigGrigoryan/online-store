import { Base } from '../../database/entity/Base';
import { SortDirection } from '../enum/SortDirection';

export interface IPaginationParams {
  offset?: number;
  limit?: number;
}

export interface ISortParams {
  sortBy?: string;
  sortAs?: SortDirection;
}

export interface IQueryBuilder {
  q?: string;
  searchBy?: string;
  id?: Base['id'];
  ids?: Base['id'][];
  sort?: string[];
  pagination?: IPaginationParams;
  limit?: number;
  offset?: number;
  withDeleted?: string | boolean;
  withRelations?: string | boolean;
}

export interface TableMetadata {
  names: string[];
  properties: string[];
  relations: any[];
}
