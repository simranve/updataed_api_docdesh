const patientRefferel = require('./../models/patientRefferel_m');

const pateintRefferelDose = require('./../models/pateintRefferelDose_m')


module.exports = {
    refferelRegistration :  async (req, res) =>{
        
        if(req.body.patient_name && req.body.facility_name && req.body.refferal_type) {

        


            let refferelDetails = {
                patient_name:req.body.patient_name,
                facility_name:req.body.facility_name,
                room_number:req.body.room_number,
                reason:req.body.reason,
                user_id:req.body.user_id,
                refferelId:req.body.user_id,
                refferal_type:req.body.refferal_type //1-nursing/assisted 2- hospital/outpatient facility
            }
            
            var refferel = new patientRefferel(refferelDetails);
    
            refferel.save(function(err, result){
                if(err){
                    res.json({status:0,message:'Oops Something went wrong', err});
                } else {
                    res.json({status:1,message:'Patient Added Succesfully',payload:result})
                }
            })
        } else {
             res.json({status:0,message:'Missing parameters!!!'})
        }
        
    },

    patientImageUpload :  async (req, res) =>{
        // console.log(req.file)
        // console.log("simran")

        if(req.file) {
              let obj = {
              	filename:req.file.filename,
              	profile_url:process.env.UPLOADURL+req.file.filename
              }
               
               let patientId = {
                _id:req.body.patientId
               }

               let patientUpdate = {
                patient_image:req.file.filename
               }

            //    console.log(req.body.patientId)
              patientRefferel.update(patientId, patientUpdate).then(ro=>{
                res.json({status:1,message:'Patient Profile has been Uploaded.', payload:ro});
              })
              .catch(err,error=>{
                res.json({status:0,message:'Patient Profile Not Uploaded.',err:err, payload:ro});
              })


            
        } else {
             res.json({status:0,message:'Oops Something went Wrong.'})
        }
        
    },

    patientUpdate:  async (req, res) =>{

         let patientId = {
          _id:req.params.id
         }
      var updateObj = {
          patient_image:req.body.patient_image,
      }  
        

        if(req.params.id && req.body.patient_image) {
            patientRefferel.update(patientId, updateObj, function(err, result){
                if(err){
                   res.json({status:0, message:'Patient Profile Not Updated', err})
                }  else {
                    res.json({status:1, message:'Patient Profile has been Updated', payload:result})
                }
                
            })
        } else {
            res.json({status:0, message:'Missing Parameters!!!'})
        }

          
    },

    patientDose :  async (req, res) =>{
        
        if(req.body.patient_name && req.body.patient_dob) {
            
            let refferelDetails = {
                patient_name:req.body.patient_name,
                patient_dob:req.body.patient_dob,
                patient_location:req.body.patient_location,
                name_of_medicine:req.body.name_of_medicine,
                dose_of_medicine:req.body.dose_of_medicine,
                frequency_dose:req.body.frequency_dose,
                pharmacy_name:req.body.pharmacy_name,
                pharmacy_fax_no:req.body.pharmacy_fax_no,
                prn_text:req.body.prn_text,
                yourfaxNumber:req.body.yourfaxNumber,
                pharmacy_phone_number:req.body.pharmacy_phone_number,
                user_id:req.body.user_id,
                refferelId:req.body.user_id
            }

            var refferelDose = new pateintRefferelDose(refferelDetails);
    
            refferelDose.save(function(err, result){
                if(err){
                    res.json({status:0,message:'Oops Something went wrong', err});
                } else {
                    res.json({status:1,message:'Patient Dose Added Succesfully',payload:result})
                }
            })
        } else {
             res.json({status:0,message:'Missing parameters!!!'})
        }
        
    }


}