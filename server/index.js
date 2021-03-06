const express = require('express')
const app = express()

const mongoose = require('mongoose')

const { User } = require('./models/User')
const bodyParse = require('body-parser')
const cookieParser = require('cookie-parser')
const config = require('./config/key')
const { auth } = require('./middleware/auth')

//몽고 연결
mongoose.connect(config.mongoURI, {
  useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected..')).catch(err => console.log(err))

const messageSchema = new mongoose.Schema({
  content: String,
  name: String,
  email: String,
  date: String,
  isDeleted: Boolean,
})

//이게 이름이구나. s가 붙고, 소문자가 된다.
const messageModel = mongoose.model('message', messageSchema);

// 백엔드 포트 번호
const port = 5000
var server = app.listen(port, async () => {
  console.log(`Example app listening at http://localhost:${port}`)

})


// socketio 생성후 서버 인스턴스 사용

app.io = require('socket.io').listen(server)
app.io.on('connection', socket => {


  socket.on('delete message', async(objectId)=>{

    var ObjectId = require('mongodb').ObjectId; 
    const query = { "_id": ObjectId(objectId)};
  // Set some fields in that document
  const update = {
    "$set":{
      "isDeleted":true,
    }
  };
  // Return the updated document instead of the original document
  const options = { returnNewDocument: true };
  
   messageModel.findOneAndUpdate(query,update,options).then((updatedDocument)=>{
      if(updatedDocument) {
        console.log(`Successfully updated document: ${updatedDocument}.`)
      } else {
        console.log("No document matches the provided query.")
      }
      return updatedDocument
    }).then(async()=>{
      const todos = await messageModel.find();
      app.io.emit('receive message', todos);
    })
  })

  socket.on('reset', async () => {
    const todos = await messageModel.find();
    app.io.emit('receive message', todos);
  })

  socket.on('send message', async (item) => {
    const msg = item.name + " " + item.email + ' : ' + item.message;


    console.log(msg);

    var moment = require('moment');
    require('moment-timezone');
    moment.tz.setDefault("Asia/Seoul");

    console.log(moment().format("YYYY MM DD HH mm ss"));

    const todo = new messageModel({ content: item.message, name: item.name, email: item.email, date: moment().format("YYYY MM DD HH mm ss") });
    await todo.save();


    const todos = await messageModel.find();
    app.io.emit('receive message', todos);
    // console.log(todos);
  });


  socket.on('disconnect', function () {
    console.log('user disconnected: ', socket.id);
  });
});
app.use(bodyParse.urlencoded({ extended: true }));

//application/json
app.use(bodyParse.json());
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send('20190204 김현수의 백엔드 서버 connected')
})

app.post('/api/users/register', (req, res) => {
  //회원 가입에 필요한 정보들을 client에서 가져오면 그것들을 데이터 베이스에 넣어준다.
  const user = new User(req.body)

  user.save((err, userInfo) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).json({
      success: true
    })
  })

})
app.post('/api/users/login', (req, res) => {
  //요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) {
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      })
    }
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);

        //토큰을 저장한다. 어디에? 쿠키, 로컬 스토리지
        //일단 여기에서는 쿠키에 하자
        res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id })


      })
    })

  })

  //요청된 이메일이 데이터 베이스에 있다면 비밀번호가 맞는 비밀번호 인지 확인.
  //비밀번호까지 맞다면 토큰을 생성하기
})

//role 1 어드민, role2 특정 부서 어드민
//role 0 -> 일반유저  role 0이 아니면 관리자

app.get('/api/users/auth', auth, (req, res) => {
  //여기까지 미들웨어를 통과해 왔다는 얘기는 Authentication 이 True라는 말
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image
  })
})
app.get('/api/users/logout', auth, (req, res) => {
  User.findOneAndUpdate({
    _id: req.user._id

  }, { token: "" }, (err, user) => {
    if (err) return res.json({ success: false, err })
    return res.status(200).send({
      success: true
    })
  })
})
