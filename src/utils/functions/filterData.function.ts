import { Document, Types } from 'mongoose';
import { APIResponse } from '../types';

// Function overload single object
function filterData<T, R extends APIResponse<T> = APIResponse<T>>(
  data: Document<unknown, {}, T> &
    T & {
      _id: Types.ObjectId;
    } & {
      __v: number;
    },
  exclude?: (keyof T)[],
): R;

// Function overload object array
function filterData<T, R extends APIResponse<T> = APIResponse<T>>(
  data: (Document<unknown, {}, T> &
    T & {
      _id: Types.ObjectId;
    } & {
      __v: number;
    })[],
  exclude?: (keyof T)[],
): R[];

// Function implementation
function filterData<T, R extends APIResponse<T> = APIResponse<T>>(
  data: any,
  exclude?: (keyof T)[],
): R | R[] | null {
  if (!data) return null;
  if (Array.isArray(data)) {
    if (!data.length) return [];
    return data.map(d => filterData(d, exclude));
  }
  const { _id: id, __v, ...rest } = data._doc;
  if (exclude && exclude.length) exclude.forEach(k => delete rest[k]);
  for (const k in rest)
    if (rest[k]?._id && !(rest[k] instanceof Types.ObjectId)) {
      const { _id: id, ...nRest } = rest[k]._doc;
      rest[k] = { id, ...nRest };
    }
  return { id, ...rest };
}

export default filterData;
