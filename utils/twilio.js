const twilio = require('twilio')(process.env.twilioSid, process.env.twilioToken);

// const client = new twilio(process.env.twilioSid, process.env.twilioToken);

const sendMessage = async (phoneNumber,code)=>{
    
   return new Promise(async(resolve,reject)=>{
        try{
            console.log(phoneNumber);
            await twilio.messages.create({
                body: `Your verfication code id ${code} from SayYes`,
                to: '+1' + phoneNumber, // Text this number
                from: process.env.twilioPhone, // From a valid Twilio number
            });
            console.log('Message Sent')
            resolve(true)
        }
        catch(e){
            console.log(e.message);
            resolve(false);
        }
   })
}

module.exports = {sendMessage};
