const patientDocument = require('./../models/patientDocument');


module.exports = {
    add_constent :  async (req, res) =>{
        console.log(req.body)
        let userData = new Object();
                        if(req.file) {
                            if(req.file.filename) userData.patientSignature = req.file.filename

                            if(req.body.provider_id) {
                                let adding_patientDocument = {
                                        provider_id:req.body.provider_id,
                                        patient_name:req.body.patient_name,
                                        pdf_docs:process.env.UPLOADURL+req.file.filename,
                                        dob:req.body.dob,
  
                                }
                                          var add = new patientDocument(adding_patientDocument);
      
                                          add.save(function(err, result){
                                          if(err){
                                                    res.json({status:0,message:'Oops Something went wrong', err});
                                          } else {
                                                    res.json({status:1,message:'Patient Document added sucessfully',payload:result})
                                          }
                                          })
                                // }
                                
                            } 
                            else {
                                        res.json({status:0,message:'Missing parameters!!!'})
                            }
                        }
                        else{
                            res.json({status:0,message:'Patient Doc is missing'})

                        }
                    
                    
                    },
                    
          
         
}