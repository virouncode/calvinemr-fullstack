import Radio from "../../UI/Radio/Radio";

const MigrationToggle = ({ isTypeChecked, handleMigrationTypeChanged }) => {
  return (
    <div className="migration-toggle">
      <div className="migration-toggle__radio">
        <Radio
          value="Export"
          name="Export"
          checked={isTypeChecked("Export")}
          onChange={handleMigrationTypeChanged}
          id="export"
          label="Export XML"
        />
      </div>
      <div className="messages-toggle__radio">
        <Radio
          value="Import"
          name="Import"
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
