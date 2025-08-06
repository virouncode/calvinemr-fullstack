import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../../api/xanoCRUD/xanoPut";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useSocketContext from "../../../../../hooks/context/useSocketContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useAppointmentPut } from "../../../../../hooks/reactquery/mutations/appointmentsMutations";
import { useSettings } from "../../../../../hooks/reactquery/queries/settingsQueries";
import {
  AppointmentType,
  DemographicsType,
  InvitationSentType,
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
  nowTZTimestamp,
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../../utils/names/toPatientName";
import { formatToE164Canadian } from "../../../../../utils/phone/formatToE164Canadian";
import CancelButton from "../../../../UI/Buttons/CancelButton";
import SaveButton from "../../../../UI/Buttons/SaveButton";
import { confirmAlert } from "../../../../UI/Confirm/ConfirmGlobal";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
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
  formDatas: AppointmentType;
  setFormDatas: React.Dispatch<React.SetStateAction<AppointmentType>>;
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
  formDatas,
  setFormDatas,
}: InvitationProps) => {
  //Hooks
  const { user } = useUserContext() as { user: UserStaffType };
  const { socket } = useSocketContext();
  const { clinic } = useClinicContext();
  const [message, setMessage] = useState("");
  const [intro, setIntro] = useState("");
  const [templateSelected, setTemplateSelected] = useState("");
  const [siteSelectedId, setSiteSelectedId] = useState(siteId ?? 0);
  const [progress, setProgress] = useState(false);

  //Queries
  const { data: settings, error, isLoading } = useSettings(hostId);
  const appointmentPut = useAppointmentPut();

  // useEffect(() => {
  //   if (settings) {
  //     setMessage(
  //       settings.invitation_templates?.find(({ name }) => name === "[FreeText]")
  //         ?.message ?? ""
  //     );
  //     setIntro(
  //       settings.invitation_templates?.find(({ name }) => name === "[FreeText]")
  //         ?.intro ?? ""
  //     );
  //   }
  // }, [settings]);

  if (error) {
    return (
      <form className="event-form__invitation">
        <ErrorParagraph errorMsg={error.message} />
      </form>
    );
  }

  if (isLoading) {
    return (
      <form className="event-form__invitation">
        <LoadingParagraph />
      </form>
    );
  }

  //HANDLERS
  const handleSend = async () => {
    if (
      templateSelected !== "Video appointment" &&
      templateSelected !== "Phone appointment" &&
      templateSelected !== "[FreeText]" &&
      !siteSelectedId
    ) {
      toast.error("Please choose a clinic address first", { containerId: "A" });
      return;
    }

    if (
      templateSelected === "Video appointment - MD is ready" &&
      !staffInfos.find(({ id }) => id === hostId)?.video_link
    ) {
      toast.error(
        "You can't send a video appointment invitation without a video call link, please see My Account section",
        { containerId: "A" }
      );
      return;
    }

    if (
      await confirmAlert({
        content: `You are about to send a ${templateSelected} invitation. Confirm ?`,
      })
    ) {
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

      if (patientsGuestsInfos.length) {
        const patientsMailsToPost: {
          to: string;
          subject: string;
          text: string;
        }[] = [];
        const patientsSMSToPost: { to: string; body: string }[] = [];

        for (const patientInfos of patientsGuestsInfos) {
          const patientName = toPatientName(patientInfos);
          const patientPhone = formatToE164Canadian(
            patientInfos.PhoneNumber.find(
              (phone) => phone._phoneNumberType === "C"
            )?.phoneNumber ?? ""
          );
          const mailToPost = {
            to: patientInfos.Email,
            //to: "virounk@gmail.com", // For testing purposes
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
              staffInfos.find(({ id }) => id === hostId)?.video_link ?? "",
              intro,
              message
            ),
          };
          patientsMailsToPost.push(mailToPost);
          const smsToPost = {
            to: patientPhone,
            //to: "+33683267962", // For testing purposes
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
              staffInfos.find(({ id }) => id === hostId)?.video_link ?? "",
              intro,
              message
            ),
          };
          patientsSMSToPost.push(smsToPost);
        }

        try {
          setProgress(true);
          await Promise.all(
            patientsMailsToPost.map((mailToPost) =>
              axios.post(`/api/mailgun`, mailToPost)
            )
          );
          await Promise.all(
            patientsSMSToPost.map((smsToPost) =>
              axios({
                url: "/api/twilio",
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                data: smsToPost,
              })
            )
          );
          toast.success(`Invitations to patients sent successfully`, {
            containerId: "A",
          });
        } catch (err) {
          if (err instanceof Error)
            toast.error(`Couldn't send invitations to patients`, {
              containerId: "A",
            });
        } finally {
          setProgress(false);
        }
      }

      if (staffGuestsInfos.length) {
        const staffEmailsToPost: {
          to: string;
          subject: string;
          text: string;
        }[] = [];
        for (const staff of staffGuestsInfos) {
          const staffName = staffIdToTitleAndName(staffInfos, staff.id);
          const emailToPost = {
            to: staff.email,
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
          };
          staffEmailsToPost.push(emailToPost);
        }
        try {
          setProgress(true);
          await Promise.all(
            staffEmailsToPost.map((emailToPost) =>
              axios.post(`/api/mailgun`, emailToPost)
            )
          );
          toast.success(`Invitations to staff members sent successfully`, {
            containerId: "A",
          });
        } catch (err) {
          if (err instanceof Error)
            toast.error(`Couldn't send invitations to staff members`, {
              containerId: "A",
            });
        } finally {
          setProgress(false);
        }
      }

      const invitationSent: InvitationSentType = {
        date: nowTZTimestamp(),
        guests_names: [
          ...patientsGuestsInfos.map((patient) => toPatientName(patient)),
          ...staffGuestsInfos.map((staff) =>
            staffIdToTitleAndName(staffInfos, staff.id)
          ),
        ],
      };

      const appointmentToPut: AppointmentType = {
        ...formDatas,
        invitations_sent: [
          ...(formDatas.invitations_sent ?? []),
          invitationSent,
        ],
      };
      setFormDatas(appointmentToPut);
      appointmentPut.mutate(appointmentToPut);
      setInvitationVisible(false);
    }
  };

  const handleSave = async () => {
    const newTemplates = [...(settings as SettingsType).invitation_templates];
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
      ...(settings as SettingsType),
      invitation_templates: newTemplates,
    };
    try {
      const response = await xanoPut(
        `/settings/${settings?.id}`,
        "staff",
        settingsToPut
      );
      socket?.emit("message", { key: ["settings", hostId] });
      if (user.id === hostId) {
        socket?.emit("message", {
          route: "USER",
          action: "update",
          content: {
            id: user.id,
            data: {
              ...user,
              settings: response,
            },
          },
        });
      }
      toast.success("Saved invitation template successfully", {
        containerId: "A",
      });
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Error: unable to save templates: ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
  };

  const handleSendAndSave = async () => {
    await handleSend();
    await handleSave();
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
    settings && (
      <form className="event-form__invitation">
        <div className="event-form__invitation-content">
          <InvitationTemplatesRadio
            handleTemplateChange={handleTemplateChange}
            templates={user.settings.invitation_templates}
            templateSelected={templateSelected}
          />
          <InvitationIntro
            intro={intro}
            handleIntroChange={handleIntroChange}
          />
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
          {(user.id === hostId ||
            user.title === "Secretary" ||
            user.title === "Nurse") && (
            <SaveButton
              onClick={handleSendAndSave}
              label="Send & Save as template"
              disabled={progress || !templateSelected || !message || !intro}
            />
          )}
          <SaveButton
            onClick={handleSend}
            label="Send"
            disabled={progress || !templateSelected || !message || !intro}
          />
          {(user.id === hostId ||
            user.title === "Secretary" ||
            user.title === "Nurse") && (
            <SaveButton
              onClick={handleSave}
              label="Save as template"
              disabled={progress || !templateSelected || !message || !intro}
            />
          )}
          <CancelButton onClick={handleCancel} />
          {progress && <CircularProgressSmall />}
        </div>
      </form>
    )
  );
};

export default Invitation;
