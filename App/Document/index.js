module.exports = ({userfirstName,userlastName,ccmConstent,bhiService,patientName,facilityName,roomNo,patientSignature,verbalConstent,careGiven,careNavigator,createdAt}) =>
{
// const today = new Date();
return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balanced Wellbeing LLC CCM/BHI Consent </title>
    <style>
        #wrapper{
            padding:20px;
            max-width:800px;
            margin:0 auto;
        }
       body,  p{
            line-height: 25px;
            font-size:16px;
            font-family: Arial, Helvetica, sans-serif;
        }
        p{
            margin-top:0;
        }
        .my-2{
            margin-top:2rem;
            margin-bottom:2rem;
        }
        input{
            border:0;
            box-shadow:none;
            appearance: none;
            -webkit-appearance: none;
            border-bottom:2px solid #000;
            background:#fff;
        }
        .box-block{
            border:2px solid #2e528f;
            padding:15px 10px;
            margin-bottom:30px;
        }
        .box-block input{
            border:0;
            box-shadow:none;
            appearance: none;
            -webkit-appearance: none;
            border-bottom:2px solid #000;
            background:#fff;
        }
        .d-flex{
            display:flex;
            align-items:center;
        }
        .patient-detail label{
            white-space: nowrap;
        }
        .patient-detail input{
            margin-left:10px;
            margin-right: 10px;
            width:100%;
        }

    </style>
</head>
<body>
    <div id="wrapper">
        <div class="page-title"  style="text-align: center;">
            <img src="images/logo.jpg" alt=""/>
            <h2 style="text-align: center; margin-top:10px;">Balanced Wellbeing LLC CCM/BHI Consent </h2>
        </div>
        <div class="box-block">
            <p><strong>Chronic Care Management (CCM)</strong> is defined as the non-face-to-face services provided to Medicare beneficiaries who have multiple (two or more), significant chronic conditions. In addition to office visits and other face-to- face encounters (billed separately), these services include communication with the patient and other treating health professionals for care coordination (both electronically and by phone), medication management, and being accessible 24 hours a day to patients and any care providers (physicians or other clinical staff). The creation and revision of electronic care plans is also a key component of <strong>CCM</strong> and can be provided to the Medicare Beneficiary. 
             </p>
             <p>
               <input type="text" value=""/></span> <strong>I consent to CCM services</strong> and understand that my care plan will either be given to me or mailed to my home address on file. 
             </p>
             <p>
                <input type="text" value=""/></span> <strong> I do NOT consent to CCM Services.</strong>
              </p>
        </div>
        <div class="box-block">
            <p><strong>Behavioral Health Integration (BHI)</strong> services include an initial assessment by the care team, consulting with relevant specialists which would include conferring with a psychiatric consultant as well as the administration of applicable validated rating scales, systematic assessments and monitoring. <strong>BHI</strong> also includes care planning between you and the care team. A BHI Care Plan will be created and provided to you accordingly. </p>
             <p>
               <input type="text" value=""/></span> <strong> I consent to BHI services</strong> and understand that my care plan will either be given to me or mailed to my home address on file.</p>
             <p>
                <input type="text" value=""/></span> <strong> I do NOT consent to BHI Services.</strong>
              </p>
        </div>
        <div class="patient-detail">
            <div class="patient-name d-flex" style="width:60%">
                <label><strong>Patient Name:</strong></label>
                <input type="text" value=""/> 
            </div>
            <div class="facility-room d-flex">
                <div class="facility d-flex" style="width:60%">
                    <label><strong>Facility Name:</strong></label>
                    <input type="text" value=""/> 
                </div>
                <div class="room d-flex" style="width:40%">
                    <label><strong>Room#:</strong></label>
                    <input type="text" value=""/> 
                </div>
            </div>
            <p class="my-2">I agree to have Balanced Wellbeing LLC as my psychiatric and psychotherapy provider for evaluations and follow ups on me as needed. I understand that a Part B copayment may apply and that I may stop Balanced Wellbeing LLC and <strong>CCM or BHI</strong> Services by either providing verbal or written notice at any time. I understand that I would remain on the program until the end of the calendar month in which notice was provided by me. </p>
            <div class="patient-rep-sign d-flex">
                <label><strong>Patient or Representative’s Signature: </strong></label>
                <input type="text" value=""/> 
            </div>
            <div class="patient-rep-sign d-flex">
                <label><strong>Verbal Consent Given By: </strong></label>
                <input type="text" value=""/> 
            </div>
            <div class="nav-date d-flex">
                <div class="care d-flex" style="width:70%">
                    <label><strong>Care Navigator: </strong></label>
                    <input type="text" value=""/> 
                </div>
                <div class="date d-flex" style="width:30%">
                    <label><strong>Date: </strong></label>
                    <input type="text" value=""/> 
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
}