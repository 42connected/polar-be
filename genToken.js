const jwt = require('jsonwebtoken');

const JWT_SECRET = 'polarpolarpolar1';

const generateCadetToken = async role => {
  console.log('-----------------------------------------\n');
  const paylaod = {
    id: undefined,
    intraId: process.argv[2],
    role: role,
  };
  console.log(paylaod);
  console.log('');
  const token = jwt.sign(paylaod, JWT_SECRET, { expiresIn: '1d' });
  console.log('bearer ' + token + '\n');
};

if (process.argv[2]) {
  console.log(`로그인 인증용 토큰 생성`);
  console.log(`토큰 만료 기간은 생성 후 1일\n${new Date()}`);
  generateCadetToken('cadet');
  generateCadetToken('mentor');
  generateCadetToken('bocal');
} else {
  console.log('Usage: node genToken.js "intraId"');
  console.log('!!! 인트라 아이디를 적어주세요 !!!');
}
