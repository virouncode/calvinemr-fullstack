import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import {
  DemographicsType,
  InvitationTemplateType,
  SettingsType,
  SiteType,
  StaffType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import { toEmailInvitationText } from "../../../../../utils/appointments/toEmailInvitationText";
import { toEmailToStaffInvitationText } from "../../../../../utils/appointments/toEmailToStaffInvitationText";
import { toSMSInvitationText } from "../../../../../utils/appointments/toSMSInvitationText";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { formatToE164Canadian } from "../../../../../utils/phone/formatToE164Canadian";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import CircularProgressSmall from "../../../../UI/Progress/CircularProgressSmall";
import InvitationInfos from "./InvitationInfos";
import InvitationIntro from "./InvitationIntro";
import InvitationMessage from "./InvitationMessage";
import InvitationTemplatesRadio from "./Templates/InvitationTemplatesRadio";
axios.defaults.withCredentials = true;

type InvitationProps = {
  setInvitationVisible: React.Dispatch<React.SetStateAction<boolean>>;
  hostId: number;
  staffInfos: StaffType[];
  start: number;
  end: number;
  patientsGuestsInfos: DemographicsType[];
  staffGuestsInfos: StaffType[];
  sites: SiteType[];
  siteId: number;
  allDay: boolean;
};

const Invitation = ({
  setInvitationVisible,
  hostId,
  staffInfos,
  start,
  end,
  patientsGuestsInfos,
  staffGuestsInfos,
  sites,
  siteId,
  allDay,
}: InvitationProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { clinic } = useClinicContext();
  const [message, setMessage] = useState(
    user.settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    )?.message ?? ""
  );
  const [intro, setIntro] = useState(
    user.settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    )?.intro ?? ""
  );
  const [templateSelected, setTemplateSelected] = useState(
    "In person appointment"
  );
  const [siteSelectedId, setSiteSelectedId] = useState(siteId ?? 0);
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleSend = async () => {
    if (
      templateSelected !== "Video appointment" &&
      templateSelected !== "Phone appointment" &&
      templateSelected !== "[Blank]" &&
      !siteSelectedId
    ) {
      toast.error("Please choose a clinic address first", { containerId: "A" });
      return;
    }

    if (
      templateSelected === "Video appointment" &&
      !staffInfos.find(({ id }) => id === user.id)?.video_link
    ) {
      toast.error(
        "You can't send a video appointment invitation without a video call link, please see My Account section",
        { containerId: "A" }
      );
      return;
    }

    const hostName = staffIdToTitleAndName(staffInfos, hostId);
    const site = sites.find(({ id }) => id === siteSelectedId);
    const siteName = site?.name ?? "";
    const clinicName = clinic?.name ?? "";
    const subject = allDay
      ? `Appointment at ${clinic?.name}-${siteName}: ${timestampToHumanDateTZ(
          start
        )} All Day`
      : `Appointment at ${clinicName}-${siteName}: ${timestampToHumanDateTimeTZ(
          start
        )} - ${timestampToHumanDateTimeTZ(end)}`;
    setProgress(true);

    for (const patientInfos of patientsGuestsInfos) {
      const patientName = toPatientName(patientInfos);
      const patientPhone = formatToE164Canadian(
        patientInfos.PhoneNumber.find((phone) => phone._phoneNumberType === "C")
          ?.phoneNumber ?? ""
      );

      try {
        await axios.post(`/api/mailgun`, {
          to: patientInfos.Email, //to be changed to patientInfos.Email
          subject: subject + " - DO NOT REPLY",
          text: toEmailInvitationText(
            site,
            user.settings.invitation_templates.find(
              ({ name }) => name === templateSelected
            ),
            hostName,
            patientName,
            siteName,
            clinicName,
            allDay,
            start,
            end,
            staffInfos.find(({ id }) => id === user.id)?.video_link ?? "",
            intro,
            message
          ),
        });
        toast.success(`Email invitation sent successfully to ${patientName}`, {
          containerId: "A",
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Couldn't send the email invitation to ${patientName}: ${err.message}`,
            {
              containerId: "A",
            }
          );
      }
      try {
        await axios({
          url: "/api/twilio",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            to: patientPhone,
            body: toSMSInvitationText(
              site,
              user.settings.invitation_templates.find(
                ({ name }) => name === templateSelected
              ),
              hostName,
              patientName,
              siteName,
              clinicName,
              allDay,
              start,
              end,
              staffInfos.find(({ id }) => id === user.id)?.video_link ?? "",
              intro,
              message
            ),
          },
        });
        toast.success(`SMS invitation sent successfully to ${patientName}`, {
          containerId: "A",
        });
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Couldn't send the SMS invitation to ${patientName}: ${err.message}`,
            {
              containerId: "A",
            }
          );
      } finally {
        setProgress(false);
      }
    }

    for (const staff of staffGuestsInfos) {
      const staffName = staffIdToTitleAndName(staffInfos, staff.id);
      try {
        await axios.post(`/api/mailgun`, {
          to: staff.email, //to be changed to staffInfos.email
          subject: subject + " - DO NOT REPLY",
          text: toEmailToStaffInvitationText(
            site,
            hostName,
            staffName,
            siteName,
            clinicName,
            allDay,
            start,
            end
          ),
        });
        toast.success(`Email invitation sent successfully to ${staffName}`, {
          containerId: "A",
        });
        setProgress(false);
      } catch (err) {
        if (err instanceof Error)
          toast.error(
            `Couldn't send the email invitation to ${staffName}: ${err.message}`,
            {
              containerId: "A",
            }
          );
        setProgress(false);
      }
    }
    setInvitationVisible(false);
  };
  const handleSendAndSave = async () => {
    await handleSend();
    const newTemplates = [...user.settings.invitation_templates];
    if (newTemplates.find(({ name }) => name === templateSelected)) {
      (
        newTemplates.find(
          ({ name }) => name === templateSelected
        ) as InvitationTemplateType
      ).intro = intro;
      (
        newTemplates.find(
          ({ name }) => name === templateSelected
        ) as InvitationTemplateType
      ).message = message;
    }
    setProgress(true);
    const settingsToPut: SettingsType = {
      ...user.settings,
      invitation_templates: newTemplates,
    };
    try {
      await xanoPut(`/settings/${user.settings.id}`, "staff", settingsToPut);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to save templates: ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
  };
  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleIntroChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setIntro(e.target.value);
  };
  const handleCancel = () => {
    setInvitationVisible(false);
  };
  const handleTemplateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplateSelected(e.target.value);
    setIntro(
      user.settings.invitation_templates.find(
        ({ name }) => name === e.target.value
      )?.intro ?? ""
    );
    setMessage(
      user.settings.invitation_templates.find(
        ({ name }) => name === e.target.value
      )?.message ?? ""
    );
  };
  const handleSiteChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  return (
    <form className="event-form__invitation">
      <div className="event-form__invitation-content">
        <InvitationTemplatesRadio
          handleTemplateChange={handleTemplateChange}
          templates={user.settings.invitation_templates}
          templateSelected={templateSelected}
        />
        <InvitationIntro intro={intro} handleIntroChange={handleIntroChange} />
        <InvitationInfos
          templateSelected={templateSelected}
          handleSiteChange={handleSiteChange}
          sites={sites}
          siteSelectedId={siteSelectedId}
        />
        <InvitationMessage
          message={message}
          handleMessageChange={handleMessageChange}
        />
      </div>
      <div className="event-form__invitation-btns">
        {user.id === hostId && (
          <SaveButton
            onClick={handleSendAndSave}
            label="Send & Save as template"
            disabled={progress}
          />
        )}
        <SaveButton onClick={handleSend} label="Send" disabled={progress} />
        <CancelButton onClick={handleCancel} />
        {progress && <CircularProgressSmall />}
      </div>
    </form>
  );
};

export default Invitation;
