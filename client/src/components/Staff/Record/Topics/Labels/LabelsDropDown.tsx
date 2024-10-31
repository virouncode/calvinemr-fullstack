import React, { useRef, useState } from "react";
import NewWindow from "react-new-window";
import { DemographicsType } from "../../../../../types/api";
import ClinicSiteLabel from "./ClinicSiteLabel";
import MdLabel from "./MdLabel";
import PatientLabel from "./PatientLabel";
import PatientLabelSimplified from "./PatientLabelSimplified";

type LabelsDropDownProps = {
  demographicsInfos: DemographicsType;
};

const LabelsDropDown = ({ demographicsInfos }: LabelsDropDownProps) => {
  const [labelVisible, setLabelVisible] = useState(false);
  const [choosenLabel, setChoosenLabel] = useState("");
  const windowRef = useRef<Window | null>(null);

  const handleClickPatientLabel = () => {
    setChoosenLabel("patient");
    setLabelVisible((v) => !v);
  };
  const handleClickPatientLabelSimplified = () => {
    setChoosenLabel("patientSimplified");
    setLabelVisible((v) => !v);
  };
  const handleClickMdLabel = () => {
    setChoosenLabel("MD");
    setLabelVisible((v) => !v);
  };
  const handleClickClinicLabel = () => {
    setChoosenLabel("clinic");
    setLabelVisible((v) => !v);
  };

  const handleOpen = (window: Window | null) => {
    windowRef.current = window;
  };

  return (
    <>
      <div className="topic-content">
        <ul>
          <li className="topic-content__link" onClick={handleClickPatientLabel}>
            - Patient label
          </li>
          <li
            className="topic-content__link"
            onClick={handleClickPatientLabelSimplified}
          >
            - Patient label (simple)
          </li>
          <li className="topic-content__link" onClick={handleClickMdLabel}>
            - MD label
          </li>
          <li className="topic-content__link" onClick={handleClickClinicLabel}>
            - Clinic site label
          </li>
        </ul>
      </div>
      {labelVisible && (
        <NewWindow
          onOpen={handleOpen}
          title={`Print ${choosenLabel} label`}
          features={{
            toolbar: "no",
            scrollbars: "no",
            menubar: "no",
            status: "no",
            directories: "no",
            width: 800,
            height: 300,
            left: 320,
            top: 200,
          }}
          onUnload={() => setLabelVisible(false)}
        >
          {choosenLabel === "patient" && (
            <PatientLabel
              demographicsInfos={demographicsInfos}
              windowRef={windowRef}
            />
          )}
          {choosenLabel === "patientSimplified" && (
            <PatientLabelSimplified
              demographicsInfos={demographicsInfos}
              windowRef={windowRef}
            />
          )}
          {choosenLabel === "MD" && <MdLabel windowRef={windowRef} />}
          {choosenLabel === "clinic" && (
            <ClinicSiteLabel
              demographicsInfos={demographicsInfos}
              windowRef={windowRef}
            />
          )}
        </NewWindow>
      )}
    </>
  );
};

export default LabelsDropDown;
