const psychometricQuestions = require('./../models/psychometricQuestions');


module.exports = {
          add_psychometricQuestions :  async (req, res) =>{
//         console.log(req.body)
        
                            if(req.body.category_id) {
                                let adding_psychometricQuestions = {
                                        category_id:req.body.category_id,
                                        optionA:req.body.optionA,
                                        optionB:req.body.optionB,
                                        optionC:req.body.optionC,
                                        optionD:req.body.optionD,
                                        optionE:req.body.optionE,

                                        optionA_marks:req.body.optionA_marks,
                                        optionB_marks:req.body.optionB_marks,
                                        optionC_marks:req.body.optionC_marks,
                                        optionD_marks:req.body.optionD_marks,
                                        optionE_marks:req.body.optionE_marks,
                                        questions:req.body.questions,

                                }

                              var add = new psychometricQuestions(adding_psychometricQuestions);

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

                    get_psychometricQuestions: async (req, res) =>{

                              
                                  let result = await psychometricQuestions.find({category_id:req.body.category_id}).sort({createdAt:-1});
                                  


                                  let ContactData = [];
                                  
     
                                  result.forEach(ro => {
                                    ContactData.push(
                                           
                                        
                                        {
                                                category_id:ro.category_id,
                                                questions:ro.questions,
                                                options:[
                                                        {
                                                                option:ro.optionA,
                                                                option_marks:ro.optionA_marks,
                                                        },
                                                        {
                                                                option:ro.optionB,
                                                                option_marks:ro.optionB_marks,
                                                        },{
                                                                option:ro.optionC,
                                                                option_marks:ro.optionC_marks,
                                                      },{
                                                                option:ro.optionD,
                                                                option_marks:ro.optionD_marks,
                                                      },{
                                                                option:ro.optionE,
                                                                option_marks:ro.optionE_marks,
                                                      }
                                                ]
                                        }, 
                                                
                                                                            
                                        
                                      )
                                      
                                  });




                                //   var data =JSON.stringify(ContactData)



                                  if(result.length>0) {
                                            res.json({status:1,message:'Opening Listing of providers.',payload: ContactData});
                                  } else {
                                            res.json({status:0,message:'Opening Listing Not found.',payload:ContactData});
                                  }    
                             
          
         
}
}