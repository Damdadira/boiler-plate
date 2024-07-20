const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const config = require('./config/key');

//모델 가져오기
const { auth } = require('./middleware/auth');
const { User } = require('./modles/User');

const mongoose = require('mongoose');
mongoose
    .connect(config.mongoURI)
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

//applicaiton/x-www-form-urlencoded 형태로 된 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

//applicaiton/json 형태로 된 데이터를 분석해서 가져옴
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/', (req, res) => res.send('hi~ hello~'));

app.post('/api/users/register', async (req, res) => {
    //회원 가입 할때 필요한 정보들을 client에서 가져오면
    //그것들을 데이터베이스에 넣어준다.

    try {
        const user = new User(req.body);
        await user.save();
        res.status(200).send(user);
    } catch (err) {
        res.status(400).send(err);
    }
});

app.post('/api/users/login', async (req, res) => {
    try {
        //1. 요청된 이메일을 데이터베이스에서 있는지 찾는다
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({
                loginSuccess: false,
                message: '이메일에 해당하는 유저가 없습니다.',
            });
        }

        //2. 요청된 이메일이 데이터베이스에 있다면, 비밀번호가 맞는 비밀번호인지 확인
        const isMatch = await user.comparePassword(req.body.password);
        //비밀번호가 다름
        if (!isMatch) {
            return res.json({
                loginSuccess: false,
                message: '비밀번호가 틀렸습니다.',
            });
        }

        //3. 비밀번호가 맞다면, 유저를 위한 토큰 생성
        const token = await user.generateToken();

        //token을 저장한다. 어디에? 쿠키
        res.cookie('x_auth', token)
            .status(200)
            .json({ loginSuccess: true, userId: user._id });
    } catch (err) {
        res.status(500).send(err);
    }
});

app.get('/api/users/auth', auth, (req, res) => {
    //여기까지 미들웨어를 통과해 왔다는 얘기는 authentication: true라는 말
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image,
    });
});

app.get('/api/users/logout', auth, async (req, res) => {
    try {
        await User.findOneAndUpdate({ id: req.user._id }, { token: '' });
        res.status(200).send({ success: true });
    } catch (err) {
        res.json({ success: false, err });
    }
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
