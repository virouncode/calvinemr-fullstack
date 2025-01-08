export const toSMSAlertPatientText = (patientName: string) => {
  return `
    Hello ${patientName},
              
  You have a new message, please login to your patient portal.
    
  Please do not reply to this sms, as this number is automated and not monitored. 
              
  Best wishes,
  Powered by Calvin EMR`;
};
