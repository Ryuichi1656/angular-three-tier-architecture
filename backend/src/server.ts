import cors from 'cors';
import express from 'express';
import { userRouter } from './routes/user';

const PORT = Number(process.env['PORT'] ?? 63000);
const FRONTEND_ORIGIN = process.env['FRONTEND_ORIGIN'] ?? 'http://localhost:14200';

const app = express();

app.use(cors({ origin: FRONTEND_ORIGIN }));
app.use(express.json());

app.use('/api', userRouter);

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening on http://localhost:${PORT}`);
  // eslint-disable-next-line no-console
  console.log(`CORS allowed origin: ${FRONTEND_ORIGIN}`);
});
