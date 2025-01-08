export const toEmailAlertPatientText = (patientName: string) => {
  return `Hello ${patientName},
    
You have a new message, please login to your patient portal.
    
Please do not reply to this email, as this address is automated and not monitored. 
    
Best wishes, 
Powered by CalvinEMR`;
};
