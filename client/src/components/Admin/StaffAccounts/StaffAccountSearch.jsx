import SiteSelect from "../../Staff/EventForm/SiteSelect";

const StaffAccountSearch = ({ search, setSearch, sites }) => {
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setSearch({ ...search, [name]: value });
  };

  const handleSiteChange = (e) => {
    setSearch({ ...search, site_id: parseInt(e.target.value) });
  };
  return (
    <div className="staff-search">
      <form className="staff-search__form">
        <div className="staff-search__row">
          <div className="staff-search__item">
            <label htmlFor="name-search">Name</label>
            <input
              type="text"
              name="name"
              value={search.name}
              onChange={handleChange}
              autoComplete="off"
              id="name-search"
              autoFocus
            />
          </div>
          <div className="staff-search__item">
            <SiteSelect
              handleSiteChange={handleSiteChange}
              sites={sites}
              value={search.site_id}
              label={true}
              all={true}
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="email-search">Email</label>
            <input
              type="text"
              name="email"
              value={search.email}
              onChange={handleChange}
              autoComplete="off"
              id="email-search"
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="phone-search">Phone</label>
            <input
              type="text"
              name="phone"
              value={search.phone}
              onChange={handleChange}
              autoComplete="off"
              id="phone-search"
              placeholder="xxx-xxx-xxxx"
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="title-search">Occupation</label>
            <input
              type="text"
              name="title"
              value={search.title}
              onChange={handleChange}
              autoComplete="off"
              id="title-search"
            />
          </div>
        </div>
        <div className="staff-search__row">
          <div className="staff-search__item">
            <label htmlFor="licence_nbr-search">Licence#</label>
            <input
              type="text"
              name="licence_nbr"
              value={search.licence_nbr}
              onChange={handleChange}
              autoComplete="off"
              id="licence_nbr-search"
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="ohip_billing_nbr-search">OHIP#</label>
            <input
              type="text"
              name="ohip_billing_nbr"
              value={search.ohip_billing_nbr}
              onChange={handleChange}
              autoComplete="off"
              id="ohip_billing_nbr-search"
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="speciality-search">Speciality</label>
            <input
              type="text"
              name="speciality"
              value={search.speciality}
              onChange={handleChange}
              autoComplete="off"
              id="speciality-search"
            />
          </div>
          <div className="staff-search__item">
            <label htmlFor="subspeciality-search">Subspeciality</label>
            <input
              type="text"
              name="subspeciality"
              value={search.subspeciality}
              onChange={handleChange}
              autoComplete="off"
              id="subspeciality-search"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default StaffAccountSearch;
