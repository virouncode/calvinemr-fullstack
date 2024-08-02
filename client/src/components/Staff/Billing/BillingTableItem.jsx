import { Tooltip } from "@mui/material";

import { useState } from "react";
import { toast } from "react-toastify";

import xanoGet from "../../../api/xanoCRUD/xanoGet";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import {
  useBillingDelete,
  useBillingPost,
  useBillingPut,
} from "../../../hooks/reactquery/mutations/billingsMutations";
import {
  dateISOToTimestampTZ,
  nowTZTimestamp,
  timestampToDateISOTZ,
} from "../../../utils/dates/formatDates";
import { staffIdToTitleAndName } from "../../../utils/names/staffIdToTitleAndName";
import { toPatientName } from "../../../utils/names/toPatientName";
import { toSiteName } from "../../../utils/names/toSiteName";
import { getLastLetter } from "../../../utils/strings/getLastLetter";
import { removeLastLetter } from "../../../utils/strings/removeLastLetter";
import { billingItemSchema } from "../../../validation/billing/billingValidation";
import { confirmAlert } from "../../All/Confirm/ConfirmGlobal";
import SignCellMultipleTypes from "../../UI/Tables/SignCellMultipleTypes";
import FakeWindow from "../../UI/Windows/FakeWindow";
import SiteSelect from "../EventForm/SiteSelect";
import DiagnosisSearch from "./DiagnosisSearch";
import PatientChartHealthSearch from "./PatientChartHealthSearch";
import ReferringOHIPSearch from "./ReferringOHIPSearch";

const BillingTableItem = ({
  billing,
  errMsgPost,
  setErrMsgPost,
  lastItemRef = null,
  sites,
}) => {
  const { user } = useUserContext();
  const { staffInfos } = useStaffInfosContext();
  const [itemInfos, setItemInfos] = useState({
    id: billing.id,
    date: billing.date,
    date_created: billing.date_created,
    created_by_id: billing.created_by_id,
    created_by_user_type: billing.created_by_user_type,
    provider_ohip_billing_nbr:
      billing.provider_ohip_billing_nbr.ohip_billing_nbr,
    referrer_ohip_billing_nbr: billing.referrer_ohip_billing_nbr || "",
    patient_id: billing.patient_id,
    patient_hcn: billing.patient_infos.HealthCard?.Number,
    patient_name: toPatientName(billing.patient_infos),
    diagnosis_code: billing.diagnosis_code.code,
    billing_code:
      billing.billing_infos.billing_code + billing.billing_code_suffix,
    site_id: billing.site_id,
    provider_fee: billing.billing_infos.provider_fee,
    assistant_fee: billing.billing_infos.assistant_fee,
    specialist_fee: billing.billing_infos.specialist_fee,
    anaesthetist_fee: billing.billing_infos.anaesthetist_fee,
    non_anaesthetist_fee: billing.billing_infos.non_anaesthetist_fee,
    updates: billing.updates,
  });
  const [editVisible, setEditVisible] = useState(false);
  const [diagnosisSearchVisible, setDiagnosisSearchVisible] = useState(false);
  const [patientSearchVisible, setPatientSearchVisible] = useState(false);
  const [refOHIPSearchVisible, setRefOHIPSearchVisible] = useState(false);
  const [progress, setProgress] = useState(false);
  const userType = user.access_level;
  const billingPost = useBillingPost();
  const billingPut = useBillingPut();
  const billingDelete = useBillingDelete();

  const handleChange = (e) => {
    setErrMsgPost("");
    const name = e.target.name;
    let value = e.target.value;
    if (name === "date") value = dateISOToTimestampTZ(value);
    setItemInfos({ ...itemInfos, [name]: value });
  };

  const handleSiteChange = (e) => {
    setItemInfos({ ...itemInfos, site_id: parseInt(e.target.value) });
  };
  const handleEditClick = () => {
    setErrMsgPost("");
    setEditVisible(true);
  };
  const handleClickDiagnosis = (e, code) => {
    setErrMsgPost("");
    setItemInfos({ ...itemInfos, diagnosis_code: code });
    setDiagnosisSearchVisible(false);
  };
  const handleClickPatient = (e, item) => {
    setErrMsgPost("");
    setItemInfos({
      ...itemInfos,
      patient_id: item.patient_id,
      patient_name: toPatientName(item),
      patient_hcn: item.HealthCard?.Number || "",
    });
    setPatientSearchVisible(false);
  };
  const handleClickRefOHIP = (e, item) => {
    setErrMsgPost("");
    setItemInfos({
      ...itemInfos,
      referrer_ohip_billing_nbr: item.ohip_billing_nbr.toString(),
    });
    setRefOHIPSearchVisible(false);
  };

  const handleCancel = () => {
    setErrMsgPost("");
    setEditVisible(false);
  };

  const handleDuplicateClick = async () => {
    const lastBillingCodeId = (await xanoGet("/last_billing_code_id", userType))
      .id;
    setProgress(true);
    const billingToPost = {
      date: itemInfos.date + lastBillingCodeId,
      date_created: nowTZTimestamp(),
      created_by_id: user.id,
      created_by_user_type: user.access_level,
      provider_id: billing.provider_id,
      referrer_ohip_billing_nbr: parseInt(itemInfos.referrer_ohip_billing_nbr),
      patient_id: itemInfos.patient_id,
      diagnosis_id: (
        await xanoGet(`/diagnosis_codes_for_code`, userType, {
          code: itemInfos.diagnosis_code,
        })
      ).id,
      billing_code_id: (
        await xanoGet(`/ohip_fee_schedule_for_code`, userType, {
          billing_code: removeLastLetter(itemInfos.billing_code),
        })
      ).id,
      site_id: itemInfos.site_id,
      billing_code_suffix: billing.billing_code_suffix,
    };
    billingPost.mutate(billingToPost, {
      onSuccess: () => {
        setEditVisible(false);
        toast.success(`Billing duplicated successfully`, { containerId: "A" });
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleSubmit = async () => {
    //Validation
    try {
      await billingItemSchema.validate(itemInfos);
    } catch (err) {
      setErrMsgPost(err.message);
      return;
    }
    setProgress(true);
    if (
      (await xanoGet("/diagnosis_codes_for_code", userType, {
        code: itemInfos.diagnosis_code,
      })) === null
    ) {
      setErrMsgPost("There is no existing diagnosis with this code");
      setProgress(false);
      return;
    }
    if (itemInfos.billing_code.includes(",")) {
      setErrMsgPost("Please enter only one billing code");
      setProgress(false);
      return;
    }
    const response = await xanoGet("/ohip_fee_schedule_for_code", userType, {
      billing_code: removeLastLetter(itemInfos.billing_code.toUpperCase()),
    });
    if (!response) {
      setErrMsgPost(
        `Billing code ${itemInfos.billing_code.toUpperCase()} doesn't exists`
      );
      setProgress(false);
      return;
    }
    //Submission
    const billingToPut = {
      id: billing.id,
      date: itemInfos.date,
      date_created: billing.date_created,
      created_by_id: billing.created_by_id,
      created_by_user_type: billing.created_by_user_type,
      provider_id: billing.provider_id,
      referrer_ohip_billing_nbr: parseInt(itemInfos.referrer_ohip_billing_nbr),
      patient_id: itemInfos.patient_id,
      diagnosis_id: (
        await xanoGet(`/diagnosis_codes_for_code`, userType, {
          code: itemInfos.diagnosis_code,
        })
      ).id,
      billing_code_id: (
        await xanoGet(`/ohip_fee_schedule_for_code`, userType, {
          billing_code: removeLastLetter(itemInfos.billing_code.toUpperCase()),
        })
      ).id,
      updates: [
        ...billing.updates,
        {
          updated_by_id: user.id,
          date_updated: nowTZTimestamp(),
          updated_by_user_type: user.access_level,
        },
      ],
      site_id: itemInfos.site_id,
      billing_code_suffix: getLastLetter(itemInfos.billing_code).toUpperCase(),
    };
    billingPut.mutate(billingToPut, {
      onSuccess: () => {
        setEditVisible(false);
        setProgress(false);
      },
      onError: () => {
        setProgress(false);
      },
    });
  };

  const handleDeleteClick = async () => {
    if (
      await confirmAlert({
        content: "Do you really want to remove this billing ?",
      })
    ) {
      setProgress(true);
      billingDelete.mutate(billing.id, {
        onSuccess: () => {
          setProgress(false);
        },
        onError: () => {
          setProgress(false);
        },
      });
    }
  };

  return (
    itemInfos && (
      <>
        <tr
          className="billing-table__item"
          style={{ border: errMsgPost && editVisible && "solid 1.5px red" }}
          ref={lastItemRef}
        >
          {user.title !== "Secretary" ? (
            <td>
              <div className="billing-table__item-btn-container">
                {!editVisible ? (
                  <>
                    <button onClick={handleEditClick} disabled={progress}>
                      Edit
                    </button>
                    <button onClick={handleDeleteClick} disabled={progress}>
                      Delete
                    </button>
                    <button onClick={handleDuplicateClick} disabled={progress}>
                      Duplicate
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="submit"
                      value="Save"
                      onClick={handleSubmit}
                      disabled={progress}
                    />

                    <button onClick={handleCancel} disabled={progress}>
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </td>
          ) : (
            <td></td>
          )}
          <td>
            {editVisible ? (
              <input
                type="date"
                value={timestampToDateISOTZ(itemInfos.date)}
                name="date"
                onChange={handleChange}
              />
            ) : (
              timestampToDateISOTZ(itemInfos.date)
            )}
          </td>
          <td>
            {editVisible ? (
              <SiteSelect
                handleSiteChange={handleSiteChange}
                sites={sites}
                value={itemInfos.site_id}
                label={false}
              />
            ) : (
              toSiteName(sites, itemInfos.site_id)
            )}
          </td>
          <td>
            <Tooltip
              title={staffIdToTitleAndName(staffInfos, billing.provider_id)}
              placement="top-start"
              arrow
            >
              <span>{itemInfos.provider_ohip_billing_nbr}</span>
            </Tooltip>
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.referrer_ohip_billing_nbr}
                  name="referrer_ohip_nbr"
                  onChange={handleChange}
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "19px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setRefOHIPSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.referrer_ohip_billing_nbr
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.patient_hcn}
                  name="patient_health_card_nbr"
                  readOnly
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "19px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setPatientSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.patient_hcn
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.patient_name}
                  name="patient_id"
                  readOnly
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "19px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setPatientSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.patient_name
            )}
          </td>
          <td style={{ position: "relative" }}>
            {editVisible ? (
              <>
                <input
                  type="text"
                  value={itemInfos.diagnosis_code}
                  name="diagnosis_code"
                  onChange={handleChange}
                />
                <i
                  style={{
                    cursor: "pointer",
                    position: "absolute",
                    right: "12px",
                    top: "19px",
                  }}
                  className="fa-solid fa-magnifying-glass"
                  onClick={() => setDiagnosisSearchVisible(true)}
                ></i>
              </>
            ) : (
              itemInfos.diagnosis_code
            )}
          </td>
          <td>
            {editVisible ? (
              <input
                type="text"
                value={itemInfos.billing_code}
                name="billing_code"
                onChange={handleChange}
              />
            ) : (
              itemInfos.billing_code
            )}
          </td>
          <td>{itemInfos.provider_fee / 10000} $</td>
          <td>{itemInfos.assistant_fee / 10000} $</td>
          <td>{itemInfos.specialist_fee / 10000} $</td>
          <td>{itemInfos.anaesthetist_fee / 10000} $</td>
          <td>{itemInfos.non_anaesthetist_fee / 10000} $</td>
          <SignCellMultipleTypes item={billing} />
        </tr>
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
      </>
    )
  );
};

export default BillingTableItem;
