import { Database } from "duckdb";
import { Action, IActionsQuery, IGetActionsReq } from "../dtos/action";

export class Actions {
  private readonly db: Database;
  private readonly csvFile: string;

  constructor(csvFile: string) {
    this.db = new Database(":memory:");
    this.csvFile = csvFile;
  }

  public async count(q?: IActionsQuery): Promise<number> {
    const where: string[] = [];
    if (!!q?.eventName) where.push(`event = '${q.eventName}'`);
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT COUNT(*) AS total FROM '${this.csvFile}' ${
          !!where?.length ? "WHERE " + where.join(" AND ") : ""
        }`,
        (err, rows) => {
          if (err) return reject(err);
          resolve(Number(rows[0].total));
        }
      );
    });
  }

  public async getActions(
    { page = 1, limit = 10 }: IGetActionsReq = {
      page: 1,
      limit: 10,
    },
    q?: IActionsQuery
  ): Promise<Array<Action>> {
    const offset = page * limit - limit;
    const where: string[] = [];
    if (!!q?.eventName) where.push(`event = '${q.eventName}'`);
    return new Promise((resolve, reject) => {
      this.db.all(
        `SELECT * FROM '${this.csvFile}' ${
          !!where?.length ? "WHERE " + where.join(" AND ") : ""
        } OFFSET ${offset} LIMIT ${limit}`,
        (err, rows) => {
          if (err) return reject(err);
          resolve(rows.map((el) => new Action(el)));
        }
      );
    });
  }
}
