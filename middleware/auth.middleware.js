import { verify } from "jsonwebtoken";

export const auth = (req, res, next) => {
  try {
    if (req.headers.authorization) {
      try {
        const token = req.headers.authorization.replace("Bearer ", "");
        const decoded = verify(token, process.env.JWT_SECRET_KEY);
        req.user = decoded;
        next();
      } catch (error) {
        return res.status(401).send({
          error: true,
          statusCode: 401,
          message: `Invelid Authorization Token`,
        });
      }
    } else {
      return res.status(401).send({
        error: true,
        statusCode: 401,
        message: `Required Authorization Token`,
      });
    }
  } catch (error) {
    return res.status(401).send({
      error: true,
      statusCode: 401,
      message: `required Authorization token`,
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req?.user?.role)) {
      return res.status(401).send({
        error: true,
        statusCode: 403,
        message: `your role is not matching`,
      });
    }
    next();
  };
};
