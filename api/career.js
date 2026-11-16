import { getCareer } from '../server/lib/data.js';
import { sendError, sendJson } from './_utils.js';

export default function handler(_req, res) {
  try {
    sendJson(res, 200, getCareer());
  } catch (err) {
    sendError(res, err);
  }
}
