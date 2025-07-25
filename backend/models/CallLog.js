const mongoose=require('mongoose');

const callLogSchema=new mongoose.Schema({
  caller:{
    type:String,
    required:true,
  },
  reciever:{
    type:String,
    required:true,
  },
  startTime:{
    type:Date,
    required:true,
  },
  endTime:{
    type:Date,
  },
  status: {
    type: String,
    enum: ['completed', 'missed', 'rejected'],
    default: 'completed'
  }
});

module.exports=mongoose.model('CallLog', callLogSchema);