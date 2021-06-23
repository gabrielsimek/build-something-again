import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';
import RepoService from '../services/RepoService.js';

describe('github user routes', () => {
  const token = `token ${process.env.GH_PERSONAL_AUTHORIZATION}`;
  let num = Math.floor(Math.random() * 100);
  
  beforeEach(() => {
    num++;
    return setup(pool);
  });

  it('creates a new repo for a github user', async () => {
    const res = await request(app)
      .post('/api/v1/repos')
      .send({
        userName: 'gabrielsimek',
        token,
        data: { 
          'name': `practiceRepo${num}`, 
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
      url: `https://github.com/gabrielsimek/practiceRepo${num}`,
      repoName: `practiceRepo${num}`
    });
  });
  it('gets a github users', async () => {
    //prevent duplicate names when test run back to back
    const repo = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${num}`, 
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
    const repo1 = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${num}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });
    const repo2 = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${num + 1}`, 
        'auto_init': true, 
        'private': false, 
        'gitignore_template': 'nanoc',
        'description': 'a practice repo'
      } });

    const res = await request(app).get('/api/v1/repos');

    expect(res.body).toEqual([repo1, repo2]);
  });
  it('updates a repo name', async () => {
    num++;
    const repo =  await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${num}`, 
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
  
    const repo = await RepoService.createRepo({
      userName: 'gabrielsimek',
      token,
      data: { 
        'name': `practiceRepo${num}`, 
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
