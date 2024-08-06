import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import xanoPut from "../../../../api/xanoCRUD/xanoPut";
import useClinicContext from "../../../../hooks/context/useClinicContext";
import useUserContext from "../../../../hooks/context/useUserContext";
import { toEmailInvitationText } from "../../../../utils/appointments/toEmailInvitationText";
import { toEmailToStaffInvitationText } from "../../../../utils/appointments/toEmailToStaffInvitationText";
import { toSMSInvitationText } from "../../../../utils/appointments/toSMSInvitationText";
import {
  timestampToHumanDateTZ,
  timestampToHumanDateTimeTZ,
} from "../../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../../utils/names/toPatientName";
import Button from "../../../UI/Buttons/Button";
import CancelButton from "../../../UI/Buttons/CancelButton";
import SiteSelect from "../SiteSelect";
import TemplatesRadio from "../Templates/TemplatesRadio";

axios.defaults.withCredentials = true;

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
}) => {
  //HOOKS
  const { user } = useUserContext();
  const { clinic } = useClinicContext();
  const [message, setMessage] = useState(
    user.settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).message
  );
  const [intro, setIntro] = useState(
    user.settings.invitation_templates.find(
      ({ name }) => name === "In person appointment"
    ).intro
  );
  const [templateSelected, setTemplateSelected] = useState(
    "In person appointment"
  );
  const [siteSelectedId, setSiteSelectedId] = useState(siteId || "");
  const [progress, setProgress] = useState(false);

  //HANDLERS
  const handleSend = async (e) => {
    e.preventDefault();
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
      !staffInfos.find(({ id }) => id === user.id).video_link
    ) {
      toast.error(
        "You can't send a video appointment invitation without a video call link, please see My Account section",
        { containerId: "A" }
      );
      return;
    }

    const hostName = staffIdToTitleAndName(staffInfos, hostId);
    const site = sites.find(({ id }) => id === siteSelectedId);
    const siteName = site?.name;
    const clinicName = clinic.name;
    const subject = allDay
      ? `Appointment at ${clinic.name}-${siteName}: ${timestampToHumanDateTZ(
          start
        )} All Day`
      : `Appointment at ${clinicName}-${siteName}: ${timestampToHumanDateTimeTZ(
          start
        )} - ${timestampToHumanDateTimeTZ(end)}`;
    setProgress(true);

    for (const patientInfos of patientsGuestsInfos) {
      const patientName = toPatientName(patientInfos);
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
            staffInfos.find(({ id }) => id === user.id).video_link,
            intro,
            message
          ),
        });
        toast.success(`Email invitation sent successfully to ${patientName}`, {
          containerId: "A",
        });
      } catch (err) {
        toast.error(
          `Couldn't send the email invitation to ${patientName}: ${err.message}`,
          {
            containerId: "A",
          }
        );
      }
      try {
        await axios({
          url: "/twilio",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: {
            to: "+33683267962", //to be changed to patient cell_phone
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
              staffInfos.find(({ id }) => id === user.id).video_link,
              intro,
              message
            ),
          },
        });
        toast.success(`SMS invitation sent successfully to ${patientName}`, {
          containerId: "A",
        });
        setProgress(false);
      } catch (err) {
        toast.error(
          `Couldn't send the SMS invitation to ${patientName}: ${err.message}`,
          {
            containerId: "A",
          }
        );
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
  const handleSendAndSave = async (e) => {
    e.preventDefault();
    handleSend(e);
    const newTemplates = [...user.settings.invitation_templates];
    newTemplates.find(({ name }) => name === templateSelected).intro = intro;
    newTemplates.find(({ name }) => name === templateSelected).message =
      message;
    setProgress(true);
    try {
      await xanoPut(`/settings/${user.settings.id}`, "staff", {
        ...user.settings,
        invitation_templates: newTemplates,
      });
    } catch (err) {
      toast.error(`Error: unable to save templates: ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };
  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };
  const handleIntroChange = (e) => {
    setIntro(e.target.value);
  };
  const handleCancel = (e) => {
    e.preventDefault();
    setInvitationVisible(false);
  };
  const handleTemplateChange = (e) => {
    setTemplateSelected(e.target.name);
    setIntro(
      user.settings.invitation_templates.find(
        ({ name }) => name === e.target.name
      ).intro
    );
    setMessage(
      user.settings.invitation_templates.find(
        ({ name }) => name === e.target.name
      ).message
    );
  };
  const handleSiteChange = async (e) => {
    setSiteSelectedId(parseInt(e.target.value));
  };

  return (
    <form className="invitation">
      <div className="invitation__edit">
        <div className="invitation__row">
          <TemplatesRadio
            handleTemplateChange={handleTemplateChange}
            templates={user.settings.invitation_templates}
            templateSelected={templateSelected}
          />
        </div>
        <div className="invitation__row">
          <label htmlFor="introduction">Introduction</label>
          <textarea
            onChange={handleIntroChange}
            value={intro}
            style={{ height: "60px" }}
            id="introduction"
          />
        </div>
        <div className="invitation__row">
          {templateSelected === "Video appointment" ? (
            <label>
              Appointment Infos (read only,{" "}
              <span style={{ color: "red" }}>
                please make sure you provided a video call link, see My Account
                section
              </span>
              )
            </label>
          ) : (
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "5px",
              }}
            >
              <label>Appointment Infos (read only)</label>
              {templateSelected !== "Video appointment" &&
                templateSelected !== "Phone appointment" &&
                templateSelected !== "[Blank]" && (
                  <div>
                    <SiteSelect
                      label="Site"
                      handleSiteChange={handleSiteChange}
                      sites={sites}
                      value={siteSelectedId}
                    />
                  </div>
                )}
            </div>
          )}
          <textarea
            value={
              user.settings.invitation_templates.find(
                ({ name }) => name === templateSelected
              ).infos
            }
            readOnly
            style={{ height: "130px" }}
          />
        </div>
        <div className="invitation__row">
          <label htmlFor="message">Message</label>
          <textarea
            onChange={handleMessageChange}
            value={message}
            style={{ height: "170px" }}
            id="message"
          />
        </div>
      </div>
      <div className="invitation__btns">
        {user.id === hostId && (
          <Button
            onClick={handleSendAndSave}
            label="Send & Save as template"
            disabled={progress}
          />
        )}
        <Button onClick={handleSend} label="Send" disabled={progress} />
        <CancelButton onClick={handleCancel} />
      </div>
    </form>
  );
};

export default Invitation;
