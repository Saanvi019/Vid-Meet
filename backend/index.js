const express= require("express");
const http=require("http");
const cors=require("cors");
const {Server}=require("socket.io");
const connectDB=require('./db');
const userRoutes=require('./routes/userRoutes');
require('dotenv').config();
const callLogRoutes = require('./routes/callLogRoutes');

const app= express();
app.use(cors());


const server=http.createServer(app);

connectDB();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use('/api/calllogs', callLogRoutes);

app.get('/', (req, res) => {
  res.send('MongoDb is connected');
});

const io= new Server(server,{
  cors:{
    origin:'*',
    methods:['GET','POST']
  }
});

io.on('connection',socket=>{
  console.log('A user connected:', socket.id);
  
  //socket.broadcast.emit('user-joined', socket.id);

  socket.on('join',(usersocketid)=>{
    console.log('user joined server',usersocketid);
    socket.broadcast.emit('user-joined', usersocketid);
  })
 
 
 socket.on('offer',({sdp,target})=>{
   io.to(target).emit('offer',{sdp, caller:socket.id});
 });
 
 socket.on('answer',({sdp,target})=>{
   io.to(target).emit('answer',{sdp})
 });
 
 socket.on('ice-candidate',({candidate, target})=>{
   io.to(target).emit('ice-candidate', {candidate})
 });

 //This listens for chat messages from one peer and sends them to the target peer using their socket ID.
 socket.on('chat-message',({to,from,text})=>{
  console.log('recieved from ',socket.id)
  io.to(to).emit('chat-message',{
    from,
    text
  })
  console.log("Sending:", { to, from, text });
 })
 
 socket.on('disconnect',()=>{
   socket.broadcast.emit ('user-disconnected',socket.id);
   console.log('user disconnected :', socket.id)
 });
});

server.listen(4000,'0.0.0.0',()=>{
  console.log("signalling");
})