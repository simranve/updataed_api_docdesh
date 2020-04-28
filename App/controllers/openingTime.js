const openingTime = require('./../models/openingTime_m');


module.exports = {
          adding_timings :  async (req, res) =>{
        
                    if(req.body.doc_id) {
                              let adding_providers = {
                                        doc_id:req.body.doc_id,
                                        day_id:req.body.day_id,
                                        openingTime:req.body.openingTime,
                                        closingTime:req.body.closingTime,

                              }
                              // let checkdoc_id = await openingTime.find({doc_id:req.body.doc_id});
                              // if (checkdoc_id.length>0) return res.status(200).send({ status: 0, message:"Provider Id already exist." });
                              //      bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
                              // if (err) throw err;
        
                              // else{
                                        var add = new openingTime(adding_providers);
    
                                        add.save(function(err, result){
                                        if(err){
                                                  res.json({status:0,message:'Oops Something went wrong', err});
                                        } else {
                                                  res.json({status:1,message:'Timings id added sucessfully',payload:result})
                                        }
                                        })
                              // }
                              
                    } 
                    else {
                              res.json({status:0,message:'Missing parameters!!!'})
                    }
                    
                    },
          
          timingsList: async (req, res) =>{
                    let result = await openingTime.find({}).sort({createdAt:-1});
                    
                    if(result.length>0) {
                              res.json({status:1,message:'Opening Listing of providers.',payload:result});
                    } else {
                              res.json({status:0,message:'Opening Listing Not found.',payload:result});
                    }
          },

          providers_timing: async (req, res) =>{

            var doc_id = req.body.doc_id;
            if(req.body.doc_id) {
                let result = await openingTime.find({doc_id:doc_id}).sort({createdAt:-1});
            
                if(result.length>0) {
                          res.json({status:1,message:'Opening Listing of providers.',payload:result});
                } else {
                          res.json({status:0,message:'Opening Listing Not found.',payload:result});
                }    
            }else{
                res.json({status:0,message:'No Doctor id.'});

            }
                    
            
  },

}