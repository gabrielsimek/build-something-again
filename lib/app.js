import express from 'express';
import notFoundMiddleware from './middleware/not-found.js';
import errorMiddleware from './middleware/error.js';
import repoController from '../controllers/repos.js';
const app = express();
app.use(express.json());

app.use('/api/v1/repos', repoController);
app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
