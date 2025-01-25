import React from "react";
import { LetterType } from "../../../../../types/api";
import { showDocument } from "../../../../../utils/files/showDocument";

type LettersDropDownProps = {
  data: LetterType[];
};

const LettersDropDown = ({ data }: LettersDropDownProps) => {
  return (
    <div className="topic-content">
      {data && data.length > 0 ? (
        <ul>
          {data.slice(0, 4).map((item) => (
            <li
              key={item.id}
              style={{ textDecoration: "underline", cursor: "pointer" }}
              onClick={() => showDocument(item.file?.url, "pdf")}
              className="topic-content__item"
            >
              - {item.name}
            </li>
          ))}
          <li>...</li>
        </ul>
      ) : (
        "No letters"
      )}
    </div>
  );
};

export default LettersDropDown;
