export const toEmailAlertStaffText = (
  staffName: string,
  senderName: string,
  messageSubject: string,
  messageBody: string
) => {
  return `Hello ${staffName},
    
You have a new message from ${senderName} : 

Subject: ${messageSubject}

${messageBody}



Please login to your staff portal for more details.
Please do not reply to this email, as this address is automated and not monitored. 
    
Best wishes, 
Powered by CalvinEMR`;
};
