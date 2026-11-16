import { getTrack } from '../../server/lib/data.js';
import { sendError, sendJson } from '../_utils.js';

export default function handler(req, res) {
  try {
    const id = req.query.id;
    sendJson(res, 200, getTrack(id));
  } catch (err) {
    sendError(res, err);
  }
}
