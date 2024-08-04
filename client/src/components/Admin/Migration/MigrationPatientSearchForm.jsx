import Input from "../../UI/Inputs/Input";
import InputEmail from "../../UI/Inputs/InputEmail";
import InputTel from "../../UI/Inputs/InputTel";

const MigrationPatientSearchForm = ({ search, handleSearch }) => {
  return (
    <div className="migration-export__patient-search">
      <form className="migration-export__patient-search__form">
        <div className="migration-export__patient-search__item">
          <Input
            value={search.name}
            onChange={handleSearch}
            name="name"
            id="name"
            label="Name"
            autoFocus={true}
          />
          <InputEmail
            value={search.email}
            onChange={handleSearch}
            name="email"
            id="email"
            label="Email"
          />
          <InputTel
            value={search.phone}
            onChange={handleSearch}
            name="phone"
            id="phone"
            label="Phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
        <div className="migration-export__patient-search__item">
          <Input
            value={search.birth}
            onChange={handleSearch}
            name="birth"
            id="birth"
            label="Date Of Birth"
          />
          <Input
            value={search.chart}
            onChange={handleSearch}
            name="chart"
            id="chart"
            label="Chart#"
          />
          <Input
            value={search.health}
            onChange={handleSearch}
            name="health"
            id="health"
            label="Health Card#"
          />
        </div>
      </form>
    </div>
  );
};

export default MigrationPatientSearchForm;
