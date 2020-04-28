const questionsCategories = require('./../models/questionsCategories');


module.exports = {
    add_question_caegories :  async (req, res) =>{
        console.log(req.body)
        
                            if(req.body.category_name) {
                                let adding_questionsCategories = {
                                        category_name:req.body.category_name,
                                }

                              var add = new questionsCategories(adding_questionsCategories);

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

                    get_question_caegories: async (req, res) =>{

                              
                                  let result = await questionsCategories.find({}).sort({createdAt:-1});
                                  
                                  if(result.length>0) {
                                            res.json({status:1,message:'Opening Listing of providers.',payload:result});
                                  } else {
                                            res.json({status:0,message:'Opening Listing Not found.',payload:result});
                                  }    
                             
          
         
}
}