

const LabResultsContent = () => {
  return (
    <div className="topic-content">
      <ul>
        <li className="labresults__link">
          <a
            href="https://ehealthontario.on.ca/en/health-care-professionals/connectingontario"
            target="_blank"
            rel="noreferrer"
          >
            - Connecting Ontario Clinical Viewer
          </a>
        </li>
        <li className="labresults__link">
          <a
            href="https://eresults.gamma-dynacare.com"
            target="_blank"
            rel="noreferrer"
          >
            - Gamma Dynacare
          </a>
        </li>
        <li className="labresults__link">
          <a
            href="https://portal.tnidoctor.com/MediExpress/DoctorPortal/portalLogin.action"
            target="_blank"
            rel="noreferrer"
          >
            - True North Imaging
          </a>
        </li>
        <li className="labresults__link">
          <a
            href="https://xra.veloximaging.net"
            target="_blank"
            rel="noreferrer"
          >
            - X-ray Associates
          </a>
        </li>
        <li className="labresults__link">
          {/* <a href="" target="_blank" rel="noreferrer"> */}- Lifelabs
          {/* </a> */}
        </li>
      </ul>
    </div>
  );
};

export default LabResultsContent;
