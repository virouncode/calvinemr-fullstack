import { InvitationTemplateType, SiteType } from "../../types/api";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../dates/formatDates";

export const toEmailInvitationText = (
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
  const cityToSend = site?.city ?? "";
  const provinceToSend = site?.province_state ?? "";
  const postalCodeToSend = site?.postal_code || site?.zip_code || "";
  const infosToSend = template
    ? template.infos
        .replace("[host_name]", hostName)
        .replace(
          "[date]",
          allDay
            ? `${timestampToHumanDateTZ(start)} All Day`
            : `${timestampToHumanDateTimeTZ(
                start
              )} - ${timestampToHumanDateTimeTZ(end)}`
        )
        .replace(
          "[address_of_clinic]",
          `${clinicName}-${siteName}, ${adressToSend} ${cityToSend} ${provinceToSend} ${postalCodeToSend}`
        )
        .replace("[video_call_link]", video_link)
    : "";
  const emailText = `Hello ${recipientName},

${intro.replace("email/text", "email")}
                          
${infosToSend}
                          
${message}

Please do not reply to this email, as this address is automated and not monitored. For further assistance, please log in to your portal.
                          
Best wishes,
Powered by Calvin EMR`;
  return emailText;
};
