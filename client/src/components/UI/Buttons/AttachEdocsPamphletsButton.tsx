import React from "react";
import { EdocType, PamphletType } from "../../../types/api";
import PaperclipIcon from "../Icons/PaperclipIcon";

type AttachEdocsPamphletsButtonProps = {
  onClick: (e: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  edocs: EdocType[];
  pamphlets: PamphletType[];
};

const AttachEdocsPamphletsButton = ({
  onClick,
  edocs,
  pamphlets,
}: AttachEdocsPamphletsButtonProps) => {
  return (
    <>
      <label>Attach edocs/pamphlets</label>
      <PaperclipIcon onClick={onClick} ml={5} />
      {edocs.map((edoc) => (
        <span key={edoc.id} style={{ marginLeft: "5px" }}>
          {edoc.name},
        </span>
      ))}
      {pamphlets.map((pamphlet) => (
        <span key={pamphlet.id} style={{ marginLeft: "5px" }}>
          {pamphlet.name},
        </span>
      ))}
    </>
  );
};

export default AttachEdocsPamphletsButton;
