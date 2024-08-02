
import { NavLink } from "react-router-dom";

const AdminHeader = ({ setCreditsVisible, setLockedScreen }) => {
  const handleLock = () => {
    setLockedScreen(true);
  };
  return (
    <header className="header header--admin">
      <div
        className="header__logo"
        onClick={() => setCreditsVisible((p) => !p)}
      ></div>
      <nav className="header__nav header__nav--admin">
        <ul>
          <li>
            <NavLink
              to="/admin/dashboard"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/staff-accounts"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Staff Accounts
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/clinic"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Clinic infos
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/billing"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Billings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/migration"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              Migration
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/my-account"
              className={(nav) =>
                nav.isActive
                  ? "header__link header__link--admin header__link--active"
                  : "header__link header__link--admin"
              }
            >
              My Account
            </NavLink>
          </li>
          <li onClick={handleLock}>
            <i className="fa-solid fa-lock" style={{ cursor: "pointer" }} />
          </li>
        </ul>
      </nav>
      <h1 className="header__title">Electronic Medical Records</h1>
    </header>
  );
};

export default AdminHeader;
