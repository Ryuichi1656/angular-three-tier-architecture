import { Router } from 'express';
import { findProfileById, updateProfile, type Profile } from '../data/profiles';

export const profileRouter = Router();

// GET /api/fetch_profile/?id=1
profileRouter.get('/fetch_profile/', (req, res) => {
  const id = Number(req.query['id']);
  if (!Number.isFinite(id)) {
    return res.status(400).json({ message: 'id is required and must be a number' });
  }

  const profile = findProfileById(id);
  if (!profile) {
    return res.status(404).json({ message: `profile not found: id=${id}` });
  }

  return res.json(profile);
});

// PUT /api/update_profile/
profileRouter.put('/update_profile/', (req, res) => {
  const body = req.body as Partial<Profile> | undefined;

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

  const updated = updateProfile({
    id: body.id,
    name: body.name,
    email: body.email,
    phone_number: body.phone_number,
    address: body.address,
  });
  if (!updated) {
    return res.status(404).json({ message: `profile not found: id=${body.id}` });
  }

  return res.json({ id: updated.id });
});
