// import fetch from 'node-fetch';
import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import RepoService from '../services/RepoService.js';

describe('github user routes', () => {
  beforeEach(() => {
    
    return setup(pool);
  });
  // afterEach(async ()  => {
    
  //   await fetch(`https://api.github.com/repos/gabrielsimek/practiceRepo${randomNum}`, {
  //     method: 'DELETE',
  //     headers: {
  //       // 'Content-Type': 'application/json',
  //       'Authorization': token,
  //     },
  //   });
        
        
  //change for ci
        
  const token = `token ${process.env.GH_PERSONAL_AUTHORIZATION}`;
  let randomNum = Math.floor(Math.random() * 1000);
  

  it('creates a new repo for a github user', async () => {
    const res = await request(app)
      .post('/api/v1/repos')
      .send({
        userName: 'gabrielsimek',
        token,
        data: { 
          'name': `practiceRepo${randomNum}`, 
          'auto_init': true, 
          'private': false, 
          'gitignore_template': 'nanoc',
          'description': 'a practice repo'
        }
      });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      userName: 'gabrielsimek',
      url: `https://github.com/gabrielsimek/practiceRepo${randomNum}`,
      repoName: `practiceRepo${randomNum}`
    });
  });
  it('gets a github users', async () => {
    randomNum += 1;
    //prevent duplicate names when test run back to back
    const repo = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${randomNum}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });

    const res = await request(app).get(`/api/v1/repos/${repo.id}`);
    expect(res.status).toBe(200);
    expect(res.body).toEqual(repo);
  });
  it('gets all of a users newly created repos', async () => {
    randomNum += 2;
    const repo1 = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${randomNum}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });
    const repo2 = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${randomNum + 1}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });

    const res = await request(app).get('/api/v1/repos');

    expect(res.body).toEqual([repo1, repo2]);
  });
  it('updates a repo name', async () => {
    randomNum += 3;
    const repo =  await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${randomNum}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });

    const res = await request(app)
      .patch(`/api/v1/repos/${repo.id}/${repo.userName}/${token}/${repo.repoName}`)
      .send({
        name: 'practiceRepoNew'
      });

   
    expect(res.body).toEqual({      
      id: '1',
      userName: 'gabrielsimek',
      url: 'https://github.com/gabrielsimek/practiceRepoNew',
      repoName: 'practiceRepoNew' });
  }
  );
  it('deletes a repo', async () => {
    randomNum += 1;
    //prevent duplicate names when test run back to back
    const repo = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${randomNum}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });
    //is this secure...
    const res = await request(app).delete(`/api/v1/repos/${repo.id}/${repo.userName}/${token}`);
    expect(res.body).toEqual(repo);
  });


});
