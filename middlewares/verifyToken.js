const jwt = require("jsonwebtoken");

function verifyToken(req, res, next) {
  const token = req.cookies.jwt;
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
    if (req.user.id === req.params.userId || req.user.role === 'CREATOR') {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAuthorizationParamsFree(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.userId || req.user.role === 'CREATOR') {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAuthorizationForCreator(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.userId) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAuthorizationForCreatorParamFree(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.id === req.body.userId) {
      next();
    } else {
      return res.status(403).json({ message: "you are not allowed" });
    }
  });
}

function verifyTokenAndAdmin(req, res, next) {
  verifyToken(req, res, () => {
    if (req.user.role === 'CREATOR') {
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