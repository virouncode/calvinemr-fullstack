import Input from "../../../UI/Inputs/Input";
import InputEmail from "../../../UI/Inputs/InputEmail";
import InputTel from "../../../UI/Inputs/InputTel";

const GuestsSearchForm = ({ search, handleSearch }) => {
  return (
    <div className="search-bar">
      <p className="search-bar-title">Search by</p>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <Input
            value={search.name}
            onChange={handleSearch}
            name="name"
            id="name-search"
            label="Name"
          />
        </div>
        <div className="search-bar-item">
          <InputEmail
            value={search.email}
            onChange={handleSearch}
            name="email"
            id="email-search"
            label="Email"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <InputTel
            value={search.phone}
            onChange={handleSearch}
            name="phone"
            id="phone-search"
            label="Phone"
            placeholder="xxx-xxx-xxxx"
          />
        </div>
        <div className="search-bar-item">
          <Input
            value={search.birth}
            onChange={handleSearch}
            name="birth"
            id="dob-search"
            label="Date of birth"
            placeholder="yyyy-mm-dd"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <Input
            value={search.chart}
            onChange={handleSearch}
            name="chart"
            id="chart-search"
            label="Chart#"
          />
        </div>
        <div className="search-bar-item">
          <Input
            value={search.health}
            onChange={handleSearch}
            name="health"
            id="health-search"
            label="Health Card#"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestsSearchForm;
