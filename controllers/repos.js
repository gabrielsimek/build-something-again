import { Router } from 'express';
import Repo from '../models/Repo';
import RepoService from '../services/RepoService';
export default Router()
  .post('/', async (req, res, next) => {

    RepoService.createRepo(req.body)
      .then(repo => res.send(repo))
      .catch(err => next(err));
  })
  .get('/:id', async (req, res, next) => {
    try {
      const repo = await Repo.findById(req.params.id);
      res.send(repo);
    } catch (error) {
      next(error);
    }
  })
  .get('/', async (req, res, next) => {
    try {
      const repo = await Repo.findAll();
      res.send(repo);
    } catch (error) {
      next(error);
    }
  })
  .patch('/:id/:user/:token/:repoName', async (req, res, next) => {
    // console.log(req.params);
    RepoService.updateRepoName(req.params, req.body)
      .then(repo => res.send(repo))
      .catch(next);
  })
  .delete('/:id/:user/:token', async (req, res, next) => {

    RepoService.deleteRepo(req.params)
      .then(repo => res.send(repo))
      .catch(next);
  });
