const { User } = require('../modles/User');

const auth = async (req, res, next) => {
    //인증 처리를 하는 곳

    //1. 클라이언트 쿠키에서 토큰을 가져온다.
    try {
        const token = req.cookies.x_auth;

        //2. 토큰을 복호화 한 후 유저를 찾는다.
        const user = await User.findByToken(token);
        if (!user) {
            throw new Error('User not found');
        }

        //3. 유저가 있으면 인증 ok, 없으면 인증 no
        req.token = token;
        req.user = user;
        next();
    } catch (err) {
        res.status(401).send({ error: 'Please authenticate' });
    }
};

module.exports = { auth };
