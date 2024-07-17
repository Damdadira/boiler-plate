const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10; //자리수

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        minlength: 5,
    },
    lastname: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0,
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    },
});

//mongoDB 메서드(저장하기 전에 이 함수를 먼저 실행하겠다)
userSchema.pre('save', function (next) {
    var user = this; //userSchema

    //password가 변환될때만 실행
    if (user.isModified('password')) {
        //비밀번호를 암호화 시킨다
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if (err) return next(err);

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);

                user.password = hash; //내가 입력한걸 hash된 비밀번호로 변경
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePaassword = function (plainPassword, callBack) {
    //plainPassword: 1234567    암호화된 비밀번호:$2b$10$chOeu7CJm5Ogry7eZOdZN.7yAVKqxDlmC1po8gS3.O3S6Jat2kkga
    //두개의 비밀번호가 같은지 비교하려면 plainPassword를 암호화해서 확인(암호화된 비밀번호를 복호화할수 없기 때문)
    bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
        if (err) return callBack(err);
        callBack(null, isMatch);
    });
};

const User = mongoose.model('User', userSchema);

module.exports = { User }; //다른곳에서도 사용할 수 있게 export
