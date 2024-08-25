import React from "react";
import { SiteType } from "../../../../../../../types/api";
import Button from "../../../../../../UI/Buttons/Button";
import CancelButton from "../../../../../../UI/Buttons/CancelButton";
import SiteSelect from "../../../../../../UI/Lists/SiteSelect";
import CircularProgressMedium from "../../../../../../UI/Progress/CircularProgressMedium";

type PrescriptionOptionsProps = {
  handleAsk: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handlePreview: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleCancel: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  handleSiteChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  sites: SiteType[];
  siteSelectedId: number;
  progress: boolean;
};

const PrescriptionOptions = ({
  handleAsk,
  handlePreview,
  handleCancel,
  handleSiteChange,
  sites,
  siteSelectedId,
  progress,
}: PrescriptionOptionsProps) => {
  return (
    <div className="prescription__actions">
      <Button onClick={handlePreview} disabled={progress} label="Preview" />
      <Button
        onClick={handleAsk}
        disabled={progress}
        label="Check interactions"
      />
      <CancelButton onClick={handleCancel} disabled={progress} />
      <SiteSelect
        label="Site"
        handleSiteChange={handleSiteChange}
        value={siteSelectedId}
        sites={sites}
      />
      {progress && <CircularProgressMedium />}
    </div>
  );
};

export default PrescriptionOptions;
