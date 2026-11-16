export function sendJson(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.end(JSON.stringify(body));
}

export function sendError(res, err) {
  sendJson(res, err.status || 500, { error: err.message || 'Server error' });
}
