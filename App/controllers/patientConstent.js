const patientConstent = require('./../models/patientConstent_m');


module.exports = {
    add_constent :  async (req, res) =>{
        console.log(req.body)
        let userData = new Object();
                        if(req.file) {
                            if(req.file.filename) userData.patientSignature = req.file.filename


                           

                            if(req.body.user_id) {
                                let adding_patientConstent = {
                                          user_id:req.body.user_id,
                                          ccmConstent:req.body.ccmConstent,
                                          bhiService:req.body.bhiService,
                                          patientName:req.body.patientName,
                                          facilityName:req.body.facilityName,
                                          roomNo:req.body.roomNo,
                                          patientSignature:process.env.UPLOADURL+req.file.filename,
                                          verbalConstent:req.body.verbalConstent,
                                        //   careGiven:req.body.careGiven,
                                          careNavigator:req.body.careNavigator,
                                    
                                }
  
  
                                
                                
                                // let checkdoc_id = await openingTime.find({doc_id:req.body.doc_id});
                                // if (checkdoc_id.length>0) return res.status(200).send({ status: 0, message:"Provider Id already exist." });
                                //      bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
                                // if (err) throw err;
          
                                // else{
                                          var add = new patientConstent(adding_patientConstent);
      
                                          add.save(function(err, result){
                                          if(err){
                                                    res.json({status:0,message:'Oops Something went wrong', err});
                                          } else {
                                                    res.json({status:1,message:'Patient Constent added sucessfully',payload:result})
                                          }
                                          })
                                // }
                                
                            } 
                            else {
                                        res.json({status:0,message:'Missing parameters!!!'})
                            }
                        }
                        else{
                            res.json({status:0,message:'Signature is missing'})

                        }
                    
                    
                    },
          
         
}