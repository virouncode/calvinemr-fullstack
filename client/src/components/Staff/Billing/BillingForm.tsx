import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { useBillingsPostsBatch } from "../../../hooks/reactquery/mutations/billingsMutations";
import {
  AdminType,
  BillingFormType,
  BillingType,
  DemographicsType,
  DoctorType,
  SiteType,
  StaffType,
  XanoPaginatedType,
} from "../../../types/api";
import { UserStaffType } from "../../../types/app";
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
import InputDate from "../../UI/Inputs/InputDate";
import InputWithSearch from "../../UI/Inputs/InputWithSearch";
import SiteSelect from "../../UI/Lists/SiteSelect";
import FakeWindow from "../../UI/Windows/FakeWindow";
import BillingCodesTextarea from "./BillingCodesTextarea";
import DiagnosisSearch from "./DiagnosisSearch";
import PatientChartHealthSearch from "./PatientChartHealthSearch";
import ProviderOHIPSearch from "./ProviderOHIPSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";
import BillingCodesTemplates from "./Templates/BillingCodesTemplates";

type BillingFormProps = {
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setErrMsgPost: React.Dispatch<React.SetStateAction<string>>;
  errMsgPost: string;
  sites: SiteType[];
};

const BillingForm = ({
  setAddVisible,
  setErrMsgPost,
  errMsgPost,
  sites,
}: BillingFormProps) => {
  //Hooks
  const navigate = useNavigate();
  const { pid, pName, hcn, date, refohip } = useParams();
  const { user } = useUserContext() as { user: UserStaffType | AdminType };
  const { staffInfos } = useStaffInfosContext();
  const [progress, setProgress] = useState(false);
  const [selectedProviderId, setSelectedProviderId] = useState(0);
  const [formDatas, setFormDatas] = useState<BillingFormType>({
    dateStr: date
      ? timestampToDateISOTZ(parseInt(date))
      : timestampToDateISOTZ(nowTZTimestamp(), "America/Toronto"),
    provider_ohip_billing_nbr:
      user.access_level === "admin" ? "" : staffIdToOHIP(staffInfos, user.id),
    referrer_ohip_billing_nbr: refohip ?? "",
    patient_id: pid ? parseInt(pid) : 0,
    patient_hcn: hcn || "",
    patient_name: pName || "",
    diagnosis_code: "",
    billing_codes: "",
    site_id:
      user.access_level === "staff" ? (user as UserStaffType).site_id : 0,
  });
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [providerOHIPSearchVisible, setProviderOHIPSearchVisible] =
    useState(false);
  const [billingCodesTemplatesVisible, setBillingCodesTemplatesVisible] =
    useState(false);
  const userType = user.access_level;
  //Queries
  const billingsPost = useBillingsPostsBatch();

  useEffect(() => {
    //to hide parameters
    if (date) {
      navigate("/staff/billing");
    }
  }, [date, navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrMsgPost("");
    const name = e.target.name;
    const value = e.target.value;
    if (name === "dateStr" && !value) return;
    setFormDatas({ ...formDatas, [name]: value });
  };
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormDatas({ ...formDatas, site_id: parseInt(value) });
  };
  const handleClickDiagnosis = (code: number) => {
    setErrMsgPost("");
    setFormDatas({ ...formDatas, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickPatient = async (item: DemographicsType) => {
    setErrMsgPost("");
    const response: XanoPaginatedType<DoctorType> = await xanoGet(
      "/doctors_of_patient",
      "staff",
      {
        patient_id: item.patient_id,
        page: 1,
      }
    );
    const patientDoctors = response?.items;
    setFormDatas({
      ...formDatas,
      patient_id: item.patient_id,
      patient_name: toPatientName(item),
      patient_hcn: item.HealthCard?.Number || "",
      referrer_ohip_billing_nbr: patientDoctors.length
        ? patientDoctors[0].ohip_billing_nbr
        : "",
    });
    setPatientSearchVisible(false);
  };

  const handleClickRefOHIP = (item: StaffType | DoctorType) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      referrer_ohip_billing_nbr: item.ohip_billing_nbr.toString(),
    });
    setRefOHIPSearchVisible(false);
  };

  // Custom type guard function
  const isStaffType = (item: StaffType | DoctorType): item is StaffType => {
    return "site_id" in item; // Replace 'someUniqueStaffProperty' with an actual unique property in StaffType
  };

  const handleClickProviderOHIP = (item: StaffType) => {
    setErrMsgPost("");
    setFormDatas({
      ...formDatas,
      provider_ohip_billing_nbr: item.ohip_billing_nbr.toString(),
    });
    setSelectedProviderId(item.id);
    setProviderOHIPSearchVisible(false);
  };

  const handleSelectTemplate = (
    e: React.MouseEvent<HTMLSpanElement, MouseEvent>,
    template_billing_codes: string[]
  ) => {
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const billingCodesArray = formDatas.billing_codes
      .trim()
      .replace(",,", ",")
      .split(",");
    //Validation
    if (selectedProviderId === 0) {
      setErrMsgPost("Please select a provider");
      return;
    }
    try {
      await billingFormSchema.validate(formDatas);
    } catch (err) {
      if (err instanceof Error) setErrMsgPost(err.message);
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
    for (const billing_code of billingCodesArray) {
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
      const billingsToPost: Partial<BillingType>[] = [];
      for (const billing_code of billingCodesArray) {
        const billingToPost: Partial<BillingType> = {
          date: dateISOToTimestampTZ(formDatas.dateStr) as number,
          date_created: nowTZTimestamp(),
          created_by_id: user.id,
          created_by_user_type: user.access_level,
          provider_id: selectedProviderId,
          referrer_ohip_billing_nbr: formDatas.referrer_ohip_billing_nbr,
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
        billingsToPost.push(billingToPost);
      }
      billingsPost.mutate(billingsToPost);
      setAddVisible(false);
    } catch (err) {
      if (err instanceof Error)
        toast.error(`Can't save billing(s): ${err.message}`, {
          containerId: "A",
        });
    } finally {
      setProgress(false);
    }
  };

  return (
    <form
      className="billing__form"
      onSubmit={handleSubmit}
      style={{ border: errMsgPost && "solid 1px red" }}
    >
      <div className="billing__form-content">
        <div className="billing__form-item">
          <InputDate
            value={formDatas.dateStr}
            onChange={handleChange}
            name="dateStr"
            id="date"
            label="Date*"
          />
        </div>
        <div className="billing__form-item" style={{ position: "relative" }}>
          <InputWithSearch
            id="provider_ohip_billing_nbr"
            name="provider_ohip_billing_nbr"
            value={formDatas.provider_ohip_billing_nbr.toString()}
            onChange={handleChange}
            onClick={() => setProviderOHIPSearchVisible(true)}
            label="Provider OHIP#*"
            readOnly={true}
            // readOnly={user.access_level !== "admin"}
            // logo={userType === "admin"}
          />
        </div>
        <div className="billing__form-item" style={{ position: "relative" }}>
          <InputWithSearch
            id="referrer_ohip_billing_nbr"
            name="referrer_ohip_billing_nbr"
            value={formDatas.referrer_ohip_billing_nbr.toString()}
            onChange={handleChange}
            onClick={() => setRefOHIPSearchVisible(true)}
            label="Referring MD OHIP#"
          />
        </div>

        <div className="billing__form-item" style={{ position: "relative" }}>
          <InputWithSearch
            id="patient_hcn"
            name="patient_hcn"
            value={formDatas.patient_hcn}
            onChange={handleChange}
            onClick={() => setPatientSearchVisible(true)}
            readOnly={true}
            label="Patient Health Card#"
          />
        </div>
        <div className="billing__form-item" style={{ position: "relative" }}>
          <InputWithSearch
            id="diagnosis_code"
            name="diagnosis_code"
            value={formDatas.diagnosis_code.toString()}
            onChange={handleChange}
            onClick={() => setDiagnosisSearchVisible(true)}
            label="Diagnosis code*"
          />
        </div>
        <div className="billing__form-item" style={{ position: "relative" }}>
          <BillingCodesTextarea
            value={formDatas.billing_codes}
            onChange={handleChange}
            onClick={() => setBillingCodesTemplatesVisible(true)}
          />
        </div>

        <div className="billing__form-item" style={{ position: "relative" }}>
          <InputWithSearch
            id="patient_id"
            name="patient_id"
            value={formDatas.patient_name}
            onClick={() => setPatientSearchVisible(true)}
            readOnly={true}
            label="Patient Name*"
          />
        </div>
        <div className="billing__form-item">
          <SiteSelect
            handleSiteChange={handleSiteChange}
            sites={sites}
            value={formDatas.site_id}
            label="Site"
          />
        </div>
      </div>
      <div className="billing__form-btns">
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
          <ProviderOHIPSearch
            handleClickProviderOHIP={handleClickProviderOHIP}
          />
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
          color="#8fb4fb"
          setPopUpVisible={setBillingCodesTemplatesVisible}
        >
          <BillingCodesTemplates handleSelectTemplate={handleSelectTemplate} />
        </FakeWindow>
      )}
    </form>
  );
};

export default BillingForm;
