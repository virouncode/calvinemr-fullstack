import React from "react";
import { PrescriptionType } from "../../../../../types/api";
import { showDocument } from "../../../../../utils/files/showDocument";
import { file } from "jszip";

type PrescriptionsDropDownProps = {
  data: PrescriptionType[];
};

const PrescriptionsDropDown = ({ data }: PrescriptionsDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length >= 1 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li
              key={item.id}
              onClick={() =>
                showDocument(
                  item.attachment.file.url,
                  item.attachment.file.mime
                )
              }
              className="topic-content__item"
              style={{
                textDecoration: "underline",
                color: "#327AE6",
                cursor: "pointer",
              }}
            >
              - {item.attachment.alias}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No past prescriptions"
      )}
    </div>
  );
};

export default PrescriptionsDropDown;
