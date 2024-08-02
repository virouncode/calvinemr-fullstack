import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../dates/formatDates";

export const toEmailToStaffInvitationText = (
  site,
  hostName,
  recipientName,
  siteName,
  clinicName,
  allDay,
  start,
  end
) => {
  const adressToSend = site?.address;
  const cityToSend = site?.city;
  const provinceToSend = site?.province_state;
  const postalCodeToSend = site?.postal_code || site?.zip_code;
  const emailText = `
Hello ${recipientName},

${hostName} has invited you to a meeting on: ${
    allDay
      ? `${timestampToHumanDateTZ(start)} All Day`
      : `${timestampToHumanDateTimeTZ(start)} - ${timestampToHumanDateTimeTZ(
          end
        )}`
  }.
  
Location: ${clinicName}-${siteName}, ${adressToSend} ${cityToSend} ${provinceToSend} ${postalCodeToSend}

Please respond to confirm your presence as soon as possible and add an event to your personal account

Please do not reply to this email, as this address is automated and not monitored. For further assistance, please log in to your portal.
                          
Best wishes,
Powered by Calvin EMR`;
  return emailText;
};
