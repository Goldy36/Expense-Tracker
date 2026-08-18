import jwt from 'jsonwebtoken';

const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET || 'expenseflow_super_secret_jwt_key_2026_internship_project';
  return jwt.sign({ id: userId }, secret, {
    expiresIn: '30d'
  });
};

export default generateToken;
