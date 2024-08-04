import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useBillingPost } from "../../../hooks/reactquery/mutations/billingsMutations";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToOHIP } from "../../../utils/names/staffIdToName";
import { toPatientName } from "../../../utils/names/toPatientName";
import { getLastLetter } from "../../../utils/strings/getLastLetter";
import { removeLastLetter } from "../../../utils/strings/removeLastLetter";
import { billingFormSchema } from "../../../validation/billing/billingValidation";
import CancelButton from "../../UI/Buttons/CancelButton";
import SubmitButton from "../../UI/Buttons/SubmitButton";
import FakeWindow from "../../UI/Windows/FakeWindow";
import SiteSelect from "../EventForm/SiteSelect";
import DiagnosisSearch from "./DiagnosisSearch";
import PatientChartHealthSearch from "./PatientChartHealthSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";
import BillingCodesTemplates from "./Templates/BillingCodesTemplates";

const BillingForm = ({ setAddVisible, setErrMsgPost, errMsgPost, sites }) => {
  const navigate = useNavigate();
  const { pid, pName, hcn, date } = useParams();
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);

  const [formDatas, setFormDatas] = useState({
    date: date
      ? timestampToDateISOTZ(parseInt(date))
      : timestampToDateISOTZ(nowTZTimestamp(), "America/Toronto"),
    provider_ohip_billing_nbr:
      user.access_level === "admin" ? "" : staffIdToOHIP(staffInfos, user.id),
    referrer_ohip_billing_nbr: "",
    patient_id: parseInt(pid) || 0,
    patient_hcn: hcn || "",
    patient_name: pName || "",
    diagnosis_code: "",
    billing_codes: "",
    site_id: user.site_id,
  });
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [providerOHIPSearchVisible, setProviderOHIPSearchVisible] =
    useState(false);
  const [billingCodesTemplatesVisible, setBillingCodesTemplatesVisible] =
    useState(false);
  const userType = user.access_level;
  const billingPost = useBillingPost();

  useEffect(() => {
    //to hide parameters
    if (date) {
      navigate("/staff/billing");
    }
  }, [date, navigate]);

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    // if (name === "billing_codes") {
    //   value = value.split(",").map((billing_code) => billing_code.trim());
    // }
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSiteChange = (e) => {
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: value });
  };
  const handleClickDiagnosis = (e, code) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickPatient = (e, item) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      patient_id: item.patient_id,
      patient_name: toPatientName(item),
      patient_hcn: item.HealthCard?.Number || "",
    });
    setPatientSearchVisible(false);
  };
  const handleClickRefOHIP = (e, item) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      referrer_ohip_billing_nbr: item.ohip_billing_nbr.toString(),
    });
    setRefOHIPSearchVisible(false);
  };

  const handleClickProviderOHIP = (e, item) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      provider_ohip_billing_nbr: item.ohip_billing_nbr.toString(),
    });
    setProviderOHIPSearchVisible(false);
  };

  const handleSelectTemplate = (e, template_billing_codes) => {
    setFormDatas({
      ...formDatas,
      billing_codes: formDatas.billing_codes
        ? `${formDatas.billing_codes},${template_billing_codes.join(",")}`
        : `${template_billing_codes.join(",")}`,
    });
  };
  const handleCancel = () => {
    setErrMsgPost("");
    setAddVisible(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const billingCodesArray = formDatas.billing_codes
      .trim()
      .replace(",,", ",")
      .split(",");
    //Validation
    try {
      await billingFormSchema.validate({
        ...formDatas,
      });
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    if (
      (await xanoGet("/diagnosis_codes_for_code", userType, {
        code: formDatas.diagnosis_code,
      })) === null
    ) {
      setErrMsgPost("There is no existing diagnosis with this code");
      return;
    }
    for (let billing_code of billingCodesArray) {
      const response = await xanoGet("/ohip_fee_schedule_for_code", userType, {
        billing_code: removeLastLetter(billing_code.toUpperCase()),
      });
      if (!response) {
        setErrMsgPost(`Billing code ${billing_code} doesn't exist`);
        return;
      }
    }

    //Submission
    try {
      setProgress(true);
      for (let billing_code of billingCodesArray) {
        const billingToPost = {
          date: dateISOToTimestampTZ(formDatas.date),
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          created_by_user_type: user.access_level,
          provider_id: user.id,
          referrer_ohip_billing_nbr: parseInt(
            formDatas.referrer_ohip_billing_nbr
          ),
          patient_id: formDatas.patient_id,
          diagnosis_id: (
            await xanoGet(`/diagnosis_codes_for_code`, userType, {
              code: formDatas.diagnosis_code,
            })
          ).id,
          billing_code_id: (
            await xanoGet(`/ohip_fee_schedule_for_code`, userType, {
              billing_code: removeLastLetter(billing_code.toUpperCase()),
            })
          ).id,
          site_id: formDatas.site_id,
          billing_code_suffix: getLastLetter(billing_code).toUpperCase(),
        };
        billingPost.mutate(billingToPost);
      }
      setAddVisible(false);
      toast.success(`Billing(s) saved successfully`, { containerId: "A" });
      setProgress(false);
    } catch (err) {
      toast.error(`Can't save billing(s): ${err.message}`, {
        containerId: "A",
      });
      setProgress(false);
    }
  };
  return (
    <form
      className="billing-form"
      onSubmit={handleSubmit}
      style={{ border: errMsgPost && "solid 1px red" }}
    >
      <div className="billing-form__row">
        <div className="billing-form__item">
          <label htmlFor="date">Date*</label>
          <input
            type="date"
            value={formDatas.date}
            name="date"
            onChange={handleChange}
            id="date"
          />
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="provider_ohip_billing_nbr">Provider OHIP#*</label>
          <input
            type="text"
            value={formDatas.provider_ohip_billing_nbr.toString()}
            name="provider_ohip_billing_nbr"
            onChange={handleChange}
            readOnly={user.access_level !== "admin"}
            id="provider_ohip_billing_nbr"
          />
          {userType === "admin" && (
            <i
              style={{
                cursor: "pointer",
                position: "absolute",
                right: "5px",
                top: "5px",
              }}
              className="fa-solid fa-magnifying-glass"
              onClick={() => setProviderOHIPSearchVisible(true)}
            ></i>
          )}
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="referrer_ohip_billing_nbr">Referring MD OHIP#</label>
          <input
            type="text"
            value={formDatas.referrer_ohip_billing_nbr.toString()}
            name="referrer_ohip_billing_nbr"
            onChange={handleChange}
            autoComplete="off"
            autoFocus
            id="referrer_ohip_billing_nbr"
          />
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setRefOHIPSearchVisible(true)}
          ></i>
        </div>
      </div>
      <div className="billing-form__row">
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="patient_hcn">Patient Health Card#</label>
          <input
            type="text"
            value={formDatas.patient_hcn}
            name="patient_hcn"
            onChange={handleChange}
            autoComplete="off"
            readOnly
            id="patient_hcn"
          />
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setPatientSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="diagnosis_code">Diagnosis code*</label>
          <input
            type="text"
            value={formDatas.diagnosis_code}
            name="diagnosis_code"
            onChange={handleChange}
            autoComplete="off"
            id="diagnosis_code"
          />
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setDiagnosisSearchVisible(true)}
          ></i>
        </div>
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="billing_codes">Billing code(s)*</label>
          <textarea
            placeholder="A001,B423,F404,..."
            value={formDatas.billing_codes}
            name="billing_codes"
            onChange={handleChange}
            autoComplete="off"
            rows={2}
            style={{
              padding: "5px 20px 5px 5px",
              whiteSpace: "pre-wrap",
              width: "170px",
            }}
            id="billing_codes"
          />
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
            }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setBillingCodesTemplatesVisible(true)}
          ></i>
        </div>
      </div>
      <div className="billing-form__row">
        <div className="billing-form__item" style={{ position: "relative" }}>
          <label htmlFor="patient_id">Patient Name*</label>
          <input
            type="text"
            value={formDatas.patient_name}
            name="patient_id"
            readOnly
            id="patient_id"
          />
          <i
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "5px",
              top: "5px",
            }}
            className="fa-solid fa-magnifying-glass"
            onClick={() => setPatientSearchVisible(true)}
          />
        </div>
        <div className="billing-form__item">
          <SiteSelect
            handleSiteChange={handleSiteChange}
            sites={sites}
            value={formDatas.site_id}
          />
        </div>
      </div>
      <div className="billing-form__btns">
        <SubmitButton disabled={progress} label="Save" />
        <CancelButton onClick={handleCancel} disabled={progress} />
      </div>
      {diagnosisSearchVisible && (
        <FakeWindow
          title="DIAGNOSIS CODES SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setDiagnosisSearchVisible}
        >
          <DiagnosisSearch handleClickDiagnosis={handleClickDiagnosis} />
        </FakeWindow>
      )}
      {providerOHIPSearchVisible && (
        <FakeWindow
          title="PROVIDER MD OHIP# SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setProviderOHIPSearchVisible}
        >
          <ReferringOHIPSearch handleClickRefOHIP={handleClickProviderOHIP} />
        </FakeWindow>
      )}
      {refOHIPSearchVisible && (
        <FakeWindow
          title="REFERRING MD OHIP# SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setRefOHIPSearchVisible}
        >
          <ReferringOHIPSearch handleClickRefOHIP={handleClickRefOHIP} />
        </FakeWindow>
      )}
      {patientSearchVisible && (
        <FakeWindow
          title="PATIENT SEARCH"
          width={800}
          height={600}
          x={(window.innerWidth - 800) / 2}
          y={(window.innerHeight - 600) / 2}
          color="#94bae8"
          setPopUpVisible={setPatientSearchVisible}
        >
          <PatientChartHealthSearch handleClickPatient={handleClickPatient} />
        </FakeWindow>
      )}
      {billingCodesTemplatesVisible && (
        <FakeWindow
          title="BILLING CODES TEMPLATES"
          width={800}
          height={600}
          x={0}
          y={0}
          color="#93b5e9"
          setPopUpVisible={setBillingCodesTemplatesVisible}
        >
          <BillingCodesTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </form>
  );
};

export default BillingForm;
