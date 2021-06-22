import pool from '../lib/utils/pool';

export default class Repo {
    id;
    userName;
    url;
    repoName;

    constructor(row){
      this.id = row.id;
      this.userName = row.user_name;
      this.url = row.url;
      this.repoName = row.repo_name;
    }

    static async insert(userName, url, repoName){
      const { rows } = await pool.query(
        `INSERT INTO repos (user_name, url, repo_name)
            VALUES ($1, $2, $3)
            RETURNING *
            `, [userName, url, repoName]
      );
      return new Repo(rows[0]);
    }

    static async remove(id){
      const { rows } = await pool.query(
        `DELETE FROM repos
        WHERE id = $1
        RETURNING *
        `, [id]
      );
      return new Repo(rows[0]);
    }
    static async findById(id){
      const { rows } = await pool.query(
        `SELECT * FROM repos
        WHERE id = $1
        `, [id]
      );
      return new Repo(rows[0]);
    }
    static async findAll(){
      const { rows } = await pool.query(
        'SELECT * FROM repos'
      );
      return rows.map(row => new Repo(row));
    }

    static async update(id, url, name){
      console.log(id, url, name);
      const { rows } = await pool.query(
        `UPDATE repos
      SET repo_name = $1,
      url = $2
      WHERE id = $3
      RETURNING * 
      `, [name, url, id]
      );
      return new Repo(rows[0]);
    }
    
}
