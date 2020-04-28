const openingDays = require('./../models/openingDays_m');


module.exports = {
          adding_providers :  async (req, res) =>{
        
                    if(req.body.days) {
                              let adding_providers = {
                                        // doc_id:req.body.doc_id,
                                        days:req.body.days
                              
                              }
                              // let checkdoc_id = await openingDays.find({doc_id:req.body.doc_id});
                              // if (checkdoc_id.length>0) return res.status(200).send({ status: 0, message:"Provider Id already exist." });
                              //      bcrypt.hash(req.body.password.toString(), 10, function(err, hash) {
                              // if (err) throw err;
        
                              // else{
                                        var add = new openingDays(adding_providers);
    
                                        add.save(function(err, result){
                                        if(err){
                                                  res.json({status:0,message:'Oops Something went wrong', err});
                                        } else {
                                                  res.json({status:1,message:'Provider id added sucessfully',payload:result})
                                        }
                                        })
                              // }
                              
                    } 
                    else {
                              res.json({status:0,message:'Missing parameters!!!'})
                    }
                    
                    },
          
          openingsList: async (req, res) =>{
                    let result = await openingDays.find({}).sort({createdAt:-1});
                    
                    if(result.length>0) {
                              res.json({status:1,message:'Day added.',payload:result});
                    } else {
                              res.json({status:0,message:'Something went wrong.',payload:result});
                    }
          },
}