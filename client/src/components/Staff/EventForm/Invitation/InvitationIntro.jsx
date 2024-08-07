const InvitationIntro = ({ intro, handleIntroChange }) => {
  return (
    <div className="invitation__row">
      <label htmlFor="introduction">Introduction</label>
      <textarea
        onChange={handleIntroChange}
        value={intro}
        style={{ height: "60px" }}
        id="introduction"
      />
    </div>
  );
};

export default InvitationIntro;
