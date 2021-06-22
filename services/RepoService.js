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

    const repo = await Repo.insert(userName, json.html_url);
    return repo;
  }
}

// RepoService.createRepo(`token ${process.env.GH_PERSONAL_AUTHORIZATION}`, { 
//   'name': 'practiceApi122', 
//   'auto_init': true, 
//   'private': false, 
//   'gitignore_template': 'nanoc',
//   'description': 'a practice repo'
    
// }).then(data => console.log(data.html_url));
