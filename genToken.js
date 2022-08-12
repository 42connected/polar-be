const jwt = require('jsonwebtoken');

const generateCadetToken = async (secret, role) => {
  console.log('-----------------------------------------\n');
  const paylaod = {
    intraId: process.argv[3],
    id: process.argv[4],
    role: role,
  };
  console.log(paylaod);
  console.log('');
  const token = jwt.sign(paylaod, secret, { expiresIn: '1d' });
  console.log('bearer ' + token + '\n');
};

if (process.argv[2]) {
  console.log(`로그인 인증용 토큰 생성`);
  console.log(`SecretKey: "${process.argv[2]}"`);
  console.log(`토큰 만료 기간은 생성 후 1일\n${new Date()}`);
  generateCadetToken(process.argv[2], 'cadet');
  generateCadetToken(process.argv[2], 'mentor');
  generateCadetToken(process.argv[2], 'bocal');
} else {
  console.log('------------------------------------');
  console.log('! Secret Key 필드가 비워져 있습니다');
  console.log('------------------------------------');
  console.log('Usage: node genToken.js SecretKey(필수) IntraId UUID');
}
