import * as jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET || 'dev-secret';
const token = jwt.sign({ sub: 1, phone: '13600000000', role: 'user' }, secret, { expiresIn: '1h' });

console.log('TEST_JWT=', token);
