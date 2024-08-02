import { useState } from "react";
import MigrationExport from "./MigrationExport";
import MigrationImport from "./MigrationImport";
import MigrationToggle from "./MigrationToggle";

const Migration = () => {
  const [type, setType] = useState("Export");
  const isTypeChecked = (option) => (option === type ? true : false);
  const handleMigrationTypeChanged = (e) => {
    if (e.target.name === "Import") {
      alert("Available soon...");
      return;
    }
    setType(e.target.value);
  };

  return (
    <>
      <MigrationToggle
        isTypeChecked={isTypeChecked}
        handleMigrationTypeChanged={handleMigrationTypeChanged}
      />
      {type === "Export" ? <MigrationExport /> : <MigrationImport />}
    </>
  );
};

export default Migration;
