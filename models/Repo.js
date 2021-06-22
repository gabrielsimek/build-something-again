import pool from '../lib/utils/pool';

export default class Repo {
    id;
    userName;
    url;

    constructor(row){
      this.id = row.id;
      this.userName = row.user_name;
      this.url = row.url;
    }

    static async insert(userName, url){
      const { rows } = await pool.query(
        `INSERT INTO repos (user_name, url)
            VALUES ($1, $2)
            RETURNING *
            `, [userName, url]
      );
      return new Repo(rows[0]);
    }
    
}
