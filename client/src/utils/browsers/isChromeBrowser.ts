export const isChromeBrowser = () => {
  const userAgent = navigator.userAgent;
  const isChrome =
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edge") &&
    !userAgent.includes("OPR") &&
    !userAgent.includes("Brave");

  return isChrome;
};
