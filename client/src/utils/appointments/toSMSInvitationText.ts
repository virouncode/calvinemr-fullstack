import { InvitationTemplateType, SiteType } from "../../types/api";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../dates/formatDates";

export const toSMSInvitationText = (
  site: SiteType | undefined,
  template: InvitationTemplateType | undefined,
  hostName: string,
  recipientName: string,
  siteName: string,
  clinicName: string,
  allDay: boolean,
  start: number,
  end: number,
  video_link: string,
  intro: string,
  message: string
) => {
  const adressToSend = site?.address ?? "";
  const cityToSend = site?.city ?? 3;
  const provinceToSend = site?.province_state ?? 3;
  const postalCodeToSend = site?.postal_code || site?.zip_code || 3;
  const infosToSend = template
    ? template.infos
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
        )
    : "";
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
