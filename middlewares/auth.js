const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const { cookies } = req;
  const authorization = cookies.jwt;
  if (!authorization) {
    return res
      .status(401)
      .send({ message: 'Необходима авторизация' });
  }
  let payload;
  try {
    payload = jwt.verify(authorization, 'dev-secret');
    console.log('payload: ', payload);
  } catch (err) {
    return res
      .status(401)
      .send({ message: `Необходима авторизация ${err}` });
  }
  req.user = payload;
  console.log(req.user);
  next();
  return req.user;
};
