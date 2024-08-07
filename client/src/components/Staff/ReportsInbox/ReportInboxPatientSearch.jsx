import Input from "../../UI/Inputs/Input";

const ReportInboxPatientSearch = ({ search, handleSearch }) => {
  return (
    <div className="patient-search">
      <div className="patient-search__form">
        <div className="patient-search__item">Search by:</div>
        <div className="patient-search__item">
          <Input
            label="Name"
            name="name"
            value={search.name}
            onChange={handleSearch}
            id="name"
            autoFocus
          />
        </div>
        <div className="patient-search__item">
          <Input
            label="Email"
            name="email"
            value={search.email}
            onChange={handleSearch}
            id="email"
          />
        </div>
        <div className="patient-search__item">
          <Input
            label="Phone"
            name="phone"
            value={search.phone}
            onChange={handleSearch}
            id="phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
        <div className="patient-search__item">
          <Input
            label="Date of birth"
            name="birth"
            value={search.birth}
            onChange={handleSearch}
            id="birth"
            placeholder="yyyy-mm-dd"
          />
        </div>
        <div className="patient-search__item">
          <Input
            label="Chart#"
            name="chart"
            value={search.chart}
            onChange={handleSearch}
            id="chart"
          />
        </div>
        <div className="patient-search__item">
          <Input
            label="Health Card#"
            name="health"
            value={search.health}
            onChange={handleSearch}
            id="health"
          />
        </div>
      </div>
    </div>
  );
};

export default ReportInboxPatientSearch;
