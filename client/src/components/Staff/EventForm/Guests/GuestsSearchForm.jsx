

const GuestsSearchForm = ({ search, handleSearch }) => {
  return (
    <div className="search-bar">
      <p className="search-bar-title">Search by</p>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label htmlFor="name-search">Name</label>
          <input
            type="text"
            name="name"
            value={search.name}
            onChange={handleSearch}
            autoComplete="off"
            id="name-search"
          />
        </div>
        <div className="search-bar-item">
          <label htmlFor="email-search">Email</label>
          <input
            type="text"
            name="email"
            value={search.email}
            onChange={handleSearch}
            autoComplete="off"
            id="email-search"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label htmlFor="phone-search">Phone</label>
          <input
            type="text"
            name="phone"
            value={search.phone}
            onChange={handleSearch}
            autoComplete="off"
            id="phone-search"
          />
        </div>
        <div className="search-bar-item">
          <label htmlFor="dob-search">Date of birth</label>
          <input
            type="text"
            name="birth"
            value={search.birth}
            onChange={handleSearch}
            autoComplete="off"
            id="dob-search"
          />
        </div>
      </div>
      <div className="search-bar-row">
        <div className="search-bar-item">
          <label htmlFor="chart-search">Chart#</label>
          <input
            type="text"
            name="chart"
            value={search.chart}
            onChange={handleSearch}
            autoComplete="off"
            id="chart-search"
          />
        </div>
        <div className="search-bar-item">
          <label htmlFor="health-search">Health Card#</label>
          <input
            type="text"
            name="health"
            value={search.health}
            onChange={handleSearch}
            autoComplete="off"
            id="health-search"
          />
        </div>
      </div>
    </div>
  );
};

export default GuestsSearchForm;
