import { IGif } from '@giphy/js-types';

export interface Result {
  data: IGif[];
  meta: {
    msg: string;
    response_id: string;
    status: number;
  };
  pagination: {
    count: number;
    total_count: number;
    offset: number;
  };
}

export interface ErrorResult {
  message?: string;
}
