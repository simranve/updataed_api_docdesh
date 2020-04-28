const storeTimings = require('./../models/storeTimings');


module.exports = {
    add_storeTiming :  async (req, res) =>{
        console.log(req.body)
        let userData = new Object();
                    //     if(req.file) {
                    //         if(req.file.filename) userData.patientSignature = req.file.filename

                            if(req.body.doc_id) {
                                let adding_storeTimings = {
                                        doc_id:req.body.doc_id,
                                        sundayTimingStartTiming:req.body.sundayTimingStartTiming,
                                        sundayTimingEndTiming:req.body.sundayTimingEndTiming,
                                        mondayTimingStartTiming:req.body.mondayTimingStartTiming,
                                        mondayTimingEndTiming:req.body.mondayTimingEndTiming,
                                        tuesdayTimingStartTiming:req.body.tuesdayTimingStartTiming,
                                        tuesdayTimingEndTiming:req.body.tuesdayTimingEndTiming,
                                        wednesdayTimingStartTiming:req.body.wednesdayTimingStartTiming,
                                        wednesdayTimingEndTiming:req.body.wednesdayTimingEndTiming,
                                        thursdayTimingStartTiming:req.body.thursdayTimingStartTiming,
                                        thursdayTimingEndTiming:req.body.thursdayTimingEndTiming,
                                        fridayTimingStartTiming:req.body.fridayTimingStartTiming,
                                        fridayTimingEndTiming:req.body.fridayTimingEndTiming,
                                        saturdayTimingStartTiming:req.body.saturdayTimingStartTiming,
                                        saturdaydayTimingEndTiming:req.body.saturdaydayTimingEndTiming,

                                        //   careGiven:req.body.careGiven,
                                        //   careNavigator:req.body.careNavigator,
  
                                }
  
  
  
                                
                                // let checkdoc_id = await openingTime.find({doc_id:req.body.doc_id});
                                // if (checkdoc_id.length>0) return res.status(200).send({ status: 0, message:"Provider Id already exist." });
                                //      bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
                                // if (err) throw err;
          
                                // else{
                                          var add = new storeTimings(adding_storeTimings);
      
                                          add.save(function(err, result){
                                          if(err){
                                                    res.json({status:0,message:'Oops Something went wrong', err});
                                          } else {
                                                    res.json({status:1,message:'Store Timing added sucessfully',payload:result})
                                          }
                                          })
                                // }
                                
                            } 
                            else {
                                        res.json({status:0,message:'Missing parameters!!!'})
                            }
                    //     }
                    //     else{
                    //         res.json({status:0,message:'Signature is missing'})

                    //     }
                    
                    
                    },

                    providers_timing: async (req, res) =>{

                              var doc_id = req.body.doc_id;
                              if(req.body.doc_id) {
                                  let result = await storeTimings.find({doc_id:doc_id}).sort({createdAt:-1});
                                  let result_data =[] 
                                  let ContactData = [];
                                  
     
                                  result.forEach(ro => {
                                    ContactData.push({
                                        day:'Sunday',
                                        start_time:ro.sundayTimingStartTiming,
                                        end_time:ro.sundayTimingEndTiming
                                      },{
                                        day:'Monday',
                                        start_time:ro.mondayTimingStartTiming,
                                        end_time:ro.mondayTimingEndTiming
                                      },{
                                        day:'Tuesday',
                                        start_time:ro.tuesdayTimingStartTiming,
                                        end_time:ro.tuesdayTimingEndTiming
                                      },{
                                        day:'Wednesday',
                                        start_time:ro.wednesdayTimingStartTiming,
                                        end_time:ro.wednesdayTimingEndTiming
                                      },{
                                        day:'Thursday',
                                        start_time:ro.thursdayTimingStartTiming,
                                        end_time:ro.thursdayTimingEndTiming
                                      },{
                                        day:'Friday',
                                        start_time:ro.fridayTimingStartTiming,
                                        end_time:ro.fridayTimingEndTiming
                                      },{
                                        day:'Saturday',
                                        start_time:ro.saturdayTimingStartTiming,
                                        end_time:ro.saturdaydayTimingEndTiming
                                      }
                                      )
                                      
                                  });
                              
                                  if(result.length>0) {
                                            res.json({status:1,message:'Opening Listing of providers.',payload:ContactData});
                                  } else {
                                            res.json({status:0,message:'Opening Listing Not found.',payload:ContactData});
                                  }    
                              }else{
                                  res.json({status:0,message:'No Doctor id.'});
                  
                              }
          
         
}
}