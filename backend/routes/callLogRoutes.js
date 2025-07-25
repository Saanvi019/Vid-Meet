const express=require('express');
const router=express.Router();
const CallLog=require('../models/CallLog');


router.post('/log',async({req,res})=>{
  try {
    const { caller, receiver, startTime, endTime, status } = req.body;
    
    // Calculate duration in seconds
    const duration = Math.floor((new Date(endTime) - new Date(startTime)) / 1000);

    const newLog = new CallLog({
      caller,
      receiver,
      startTime,
      endTime,
      duration,
      status,
    });

    await newLog.save();
    res.status(201).json({ message: 'Call log saved', log: newLog });

  } catch (error) {
    res.status(500).json({ message: 'Failed to save call log', error: error.message });
  }
})
router.get('/', async (req, res) => {
  try {
    const logs = await CallLog.find().sort({ startTime: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;