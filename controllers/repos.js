import { Router } from 'express';
import RepoService from '../services/RepoService';
export default Router()
  .post('/', async (req, res, next) => {
   
    RepoService.createRepo(req.body)
      .then(repo => res.send(repo))
      .catch(err => next(err));
  });
