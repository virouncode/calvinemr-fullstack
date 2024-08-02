import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../dates/formatDates";

export const toSMSInvitationText = (
  site,
  template,
  hostName,
  recipientName,
  siteName,
  clinicName,
  allDay,
  start,
  end,
  video_link,
  intro,
  message
) => {
  const adressToSend = site?.address;
  const cityToSend = site?.city;
  const provinceToSend = site?.province_state;
  const postalCodeToSend = site?.postal_code || site?.zip_code;
  const infosToSend = template.infos
    .replace(
      "[host_name]",
      `
    ${hostName}
    `
    )
    .replace(
      "[date]",
      allDay
        ? `
      ${timestampToHumanDateTZ(start)} All Day
      `
        : `
      ${timestampToHumanDateTimeTZ(start)} - ${timestampToHumanDateTimeTZ(end)}
        `
    )
    .replace(
      "[address_of_clinic]",
      `
    ${clinicName}-${siteName}, ${adressToSend} ${cityToSend} ${provinceToSend} ${postalCodeToSend}
    `
    )
    .replace(
      "[video_call_link]",
      `
    ${video_link}
    `
    );
  const smsText = `
Hello ${recipientName},
              
${intro.replace("email/text", "text")}
                          
${infosToSend}
                          
${message}

Please do not reply to this sms, as this number is automated and not monitored. For further assistance, please log in to your portal.

Best wishes,
Powered by Calvin EMR`;
  return smsText;
};
