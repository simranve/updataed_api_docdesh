const answersSubmition = require('./../models/answersSubmition');


module.exports = {
          submit_answers :  async (req, res) =>{
        
        
                            if(req.body.doc_id && req.body.category_id && req.body.patientName && req.body.marks && req.body.dob) {
                                let adding_answersSubmition = {
                                        doc_id:req.body.doc_id,
                                        category_id:req.body.category_id,
                                        patientName:req.body.patientName,
                                        marks:req.body.marks,
                                        dob:req.body.dob,

                                }

                              var add = new answersSubmition(adding_answersSubmition);

                              add.save(function(err, result){
                              if(err){
                                        res.json({status:0,message:'Oops Something went wrong', err});
                              } else {
                                        res.json({status:1,message:'Answers submitted sucessfully',payload:result})
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
}