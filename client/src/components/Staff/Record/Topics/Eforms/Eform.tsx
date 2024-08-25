import { useState } from "react";

import React from "react";
import useClinicContext from "../../../../../hooks/context/useClinicContext";
import useStaffInfosContext from "../../../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../../../hooks/context/useUserContext";
import { useEformsBlank } from "../../../../../hooks/reactquery/queries/eformsBlankQueries";
import { useSites } from "../../../../../hooks/reactquery/queries/sitesQueries";
import {
  ClinicType,
  DemographicsType,
  SiteType,
} from "../../../../../types/api";
import { UserStaffType } from "../../../../../types/app";
import fillPdfForm from "../../../../../utils/eforms/fillPdfForm";
import {
  toPatientFirstName,
  toPatientLastName,
} from "../../../../../utils/names/toPatientName";
import ErrorParagraph from "../../../../UI/Paragraphs/ErrorParagraph";
import LoadingParagraph from "../../../../UI/Paragraphs/LoadingParagraph";
import EformPostPdfViewer from "./EformPostPdfViewer";
import EformsList from "./EformsList";

type EformProps = {
  demographicsInfos: DemographicsType;
  setAddVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const Eform = ({ demographicsInfos, setAddVisible }: EformProps) => {
  const { user } = useUserContext() as { user: UserStaffType };
  const { clinic } = useClinicContext();
  const { staffInfos } = useStaffInfosContext();
  const [formSelectedId, setFormSelectedId] = useState(0);
  const [url, setUrl] = useState("");
  const {
    data: sites,
    isPending: isPendingSites,
    error: errorSites,
  } = useSites();

  const {
    data: eformsBlank,
    isPending: isPendingEformsBlank,
    error: errorEformsBlank,
  } = useEformsBlank();

  const handleFormChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormSelectedId(parseInt(e.target.value));
    const fileURL = eformsBlank?.find(
      ({ id }) => id === parseInt(e.target.value)
    )?.file?.url;
    console.log("fileURL", fileURL);
    const filledFormURL = await fillPdfForm(
      fileURL ?? "",
      demographicsInfos,
      staffInfos,
      user,
      sites?.find(({ id }) => id === user.site_id) as SiteType,
      clinic as ClinicType
    );
    setUrl(filledFormURL ?? "");

    // setIsLoadingFile(true);
    // const url = eformsBlank.find(({ id }) => id === parseInt(e.target.value))
    //   ?.file?.url;

    // try {
    //   showDocument(
    //     await fillPdfForm(
    //       url,
    //       demographicsInfos,
    //       staffInfos,
    //       user,
    //       sites.find(({ id }) => id === user.site_id),
    //       clinic,
    //       title
    //     ),
    //     "pdf"
    //   );
    //   setIsLoadingFile(false);
    // } catch (err) {
    //   setIsLoadingFile(false);
    //   alert(`Can't fill in e-form: ${err.message}`);
    // }
  };

  if (isPendingSites || isPendingEformsBlank)
    return (
      <div className="eforms__form">
        <LoadingParagraph />
      </div>
    );

  if (errorSites || errorEformsBlank)
    return (
      <div className="eforms__form">
        <ErrorParagraph
          errorMsg={errorSites?.message || errorEformsBlank?.message || ""}
        />
      </div>
    );

  return (
    <>
      <div className="eforms__form">
        <div className="eforms__explainations">
          <ul>
            <li>
              1. Choose a blank e-form:{" "}
              <EformsList
                handleFormChange={handleFormChange}
                formSelectedId={formSelectedId}
                eformsBlank={eformsBlank}
              />
            </li>
            <li>
              2. The e-form is pre-filled with relevant information. Fill-in the
              rest with relevant information
            </li>
            <li>
              3. A Save button will appear in the top toolbar when you make your
              first change
            </li>
          </ul>
        </div>
        {url && (
          <EformPostPdfViewer
            url={url}
            patientId={demographicsInfos.patient_id}
            patientFirstName={toPatientFirstName(demographicsInfos)}
            patientLastName={toPatientLastName(demographicsInfos)}
            fileName={
              eformsBlank?.find(({ id }) => id === formSelectedId)?.name ?? ""
            }
            setAddVisible={setAddVisible}
          />
        )}
      </div>
    </>
  );
};

export default Eform;
