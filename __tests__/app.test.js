import pool from '../lib/utils/pool.js';
import setup from '../data/setup.js';
import request from 'supertest';
import app from '../lib/app.js';

describe('github user routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  it('creates a new repo for a github user', async () => {
    const randomNum = 1; //change for ci
    // Math.floor(Math.random() * 100);
    const res = await request(app)
      .post('/api/v1/repos')
      .send({
        userName: 'gabrielsimek',
        token: `token ${process.env.GH_PERSONAL_AUTHORIZATION}`,
        data: { 
          'name': `practiceApi${randomNum}`, 
          'auto_init': true, 
          'private': false, 
          'gitignore_template': 'nanoc',
          'description': 'a practice repo'
        } });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      id: '1',
      userName: 'gabrielsimek',
      url: `https://github.com/gabrielsimek/practiceApi${randomNum}`
    });
  });
});

