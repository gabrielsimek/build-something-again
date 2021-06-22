import fetch from 'node-fetch';
// import dotenv from 'dotenv';
// dotenv.config();
import Repo from '../models/Repo';
export default class RepoService {
  //eslint-disable-next-line no-unused-vars
  static async createRepo({ token, data, userName }){
    const res = await fetch('https://api.github.com/user/repos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    // return json.html_url;  

    const repo = await Repo.insert(userName, json.html_url, json.name);
    return repo;
  }

  static async deleteRepo({ id, user, token }){
    const deletedRepo = await Repo.remove(id);

    await fetch(`https://api.github.com/repos/${user}/${deletedRepo.repoName}`, {
      method: 'DELETE',
      headers: {
        // 'Content-Type': 'application/json',
        'Authorization': token,
      },
    });

    return deletedRepo;
  }

  static async updateRepoName({ id, user, token, repoName }, data){
    
    const res = await fetch(`https://api.github.com/repos/${user}/${repoName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();

    const updatedRepo = await Repo.update(id, json.html_url, json.name);
    return updatedRepo;
    
  }
}

