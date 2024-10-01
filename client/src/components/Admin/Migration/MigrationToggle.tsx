import React from "react";
import Radio from "../../UI/Radio/Radio";

type MigrationToggleProps = {
  isTypeChecked: (option: "Import" | "Export") => boolean;
  handleMigrationTypeChanged: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const MigrationToggle = ({
  isTypeChecked,
  handleMigrationTypeChanged,
}: MigrationToggleProps) => {
  return (
    <div className="migration__toggle">
      <div className="migration__toggle-radio">
        <Radio
          value="Export"
          name="migration-type"
          checked={isTypeChecked("Export")}
          onChange={handleMigrationTypeChanged}
          id="export"
          label="Export XML"
        />
      </div>
      <div className="migration__toggle-radio">
        <Radio
          value="Import"
          name="migration-type"
          checked={isTypeChecked("Import")}
          onChange={handleMigrationTypeChanged}
          id="import"
          label="Import XML"
        />
      </div>
    </div>
  );
};

export default MigrationToggle;
