const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.headers.token;
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET);
      req.user = decoded;
      next();
    } catch (error) {
      res.status(401).json({ message: "invalid token" });
    }
  } else {
    res.status(401).json({ message: "no token provided" });
  }
}

function verifyTokenAndAuthorization(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAuthorizationParamsFree(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.id || req.user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAuthorizationForCreator(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAuthorizationForCreatorParamFree(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.id) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'ADMIN') {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed, only admin allowed" });
    }
  });
}

module.exports = {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAuthorizationForCreator,
  verifyTokenAndAuthorizationParamsFree,
  verifyTokenAndAuthorizationForCreatorParamFree,
  verifyTokenAndAdmin
};