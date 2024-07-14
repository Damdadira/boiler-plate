const express = require('express');
const app = express();
const port = 5000;
const bodyParser = require('body-parser');

//모델 가져오기
const { User } = require('./modles/User');

const mongoose = require('mongoose');
mongoose
    .connect('mongodb+srv://damdadi:1234@cluster0.e0xujcy.mongodb.net/')
    .then(() => console.log('MongoDB Connected...'))
    .catch((err) => console.log(err));

//applicaiton/x-www-form-urlencoded 형태로 된 데이터를 분석해서 가져옴
app.use(bodyParser.urlencoded({ extended: true }));

//applicaiton/json 형태로 된 데이터를 분석해서 가져옴
app.use(bodyParser.json());

app.get('/', (req, res) => res.send('hi'));

app.post('/register', async (req, res) => {
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

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
