import React from "react";
import { PersonalHistoryType } from "../../../../../types/api";
import { getResidualInfo } from "../../../../../utils/migration/exports/getResidualInfo";

type PersonalHistoryDropDownProps = {
  data: PersonalHistoryType[];
};

const PersonalHistoryDropDown = ({ data }: PersonalHistoryDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <>
          <p>
            <label>Occupations: </label>
            {getResidualInfo("Occupations", data[0])}
          </p>
          <p>
            <label>Income: </label>
            {getResidualInfo("Income", data[0])}
          </p>
          <p>
            <label>Religion: </label>
            {getResidualInfo("Religion", data[0])}
          </p>
          <p>
            <label>Sexual orientation: </label>
            {getResidualInfo("SexualOrientation", data[0])}
          </p>
          <p>
            <label>Special diet: </label>
            {getResidualInfo("SpecialDiet", data[0])}
          </p>
          <p>
            <label>Smoking: </label>
            {getResidualInfo("Smoking", data[0])}
          </p>
          <p>
            <label>Alcohol: </label>
            {getResidualInfo("Alcohol", data[0])}
          </p>
          <p>
            <label>Recreational drugs: </label>
            {getResidualInfo("RecreationalDrugs", data[0])}
          </p>
        </>
      ) : (
        "No personal history"
      )}
    </div>
  );
};

export default PersonalHistoryDropDown;
