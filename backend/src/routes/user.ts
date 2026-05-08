import { Router } from 'express';
import { createUser, findUserById, listUsers, updateUser, type User } from '../data/users';

export const userRouter = Router();

// GET /api/list_users/
userRouter.get('/list_users/', (_req, res) => {
  return res.json(listUsers());
});

// POST /api/create_user/
userRouter.post('/create_user/', (req, res) => {
  const body = req.body as Partial<Omit<User, 'id'>> | undefined;

  if (
    !body ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.phone_number !== 'string' ||
    typeof body.address !== 'string'
  ) {
    return res.status(400).json({ message: 'invalid request body' });
  }

  const created = createUser({
    name: body.name,
    email: body.email,
    phone_number: body.phone_number,
    address: body.address,
  });

  return res.status(201).json({ id: created.id });
});

// GET /api/fetch_user/?id=1
userRouter.get('/fetch_user/', (req, res) => {
  const id = Number(req.query['id']);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: 'id is required and must be a number' });
  }

  const user = findUserById(id);
  if (!user) {
    return res.status(404).json({ message: `user not found: id=${id}` });
  }

  return res.json(user);
});

// PUT /api/update_user/
userRouter.put('/update_user/', (req, res) => {
  const body = req.body as Partial<User> | undefined;

  if (
    !body ||
    typeof body.id !== 'number' ||
    typeof body.name !== 'string' ||
    typeof body.email !== 'string' ||
    typeof body.phone_number !== 'string' ||
    typeof body.address !== 'string'
  ) {
    return res.status(400).json({ message: 'invalid request body' });
  }

  const updated = updateUser({
    id: body.id,
    name: body.name,
    email: body.email,
    phone_number: body.phone_number,
    address: body.address,
  });
  if (!updated) {
    return res.status(404).json({ message: `user not found: id=${body.id}` });
  }

  return res.json({ id: updated.id });
});
