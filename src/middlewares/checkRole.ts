export default (requiredRole) => {
  return (req, res, next) => {
    if(req.currentUser.role !== requiredRole) {
      return res.status(401).end();
    } else {
      console.log('User has met required role, going to next middleware');
      return next();
    }
  }
}
