export function getCookieFromRequest(req, name) {
    if (req.cookies && req.cookies[name]) {
      return req.cookies[name];
    }
    return null;
  }


export default getCookieFromRequest;