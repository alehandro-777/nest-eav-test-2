import { UpdateEdto } from "./dto/update-table-e.dto";
import { DeleteEdto } from "./dto/delete-table-e.dto";

export interface TableERepository {
  findMany(ts: string, from: string, to: string);
  upsert(upsertRowDto: UpdateEdto[]);
  softDelete(deleteRowDto: DeleteEdto[]);
}