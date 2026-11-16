import { listTracks } from '../../server/lib/data.js';
import { sendJson } from '../_utils.js';

export default function handler(_req, res) {
  sendJson(res, 200, listTracks());
}
