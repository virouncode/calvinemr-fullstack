import { useEffect } from "react";
import { SiteType, StaffType } from "../../types/api";

export const useSiteClosed = (
  sites: SiteType[] | undefined,
  user: StaffType
) => {
  useEffect(() => {
    if (!sites) return;
    if (
      user.access_level === "staff" &&
      sites.find(({ id }) => id === user.site_id)?.site_status === "Closed"
    ) {
      alert(
        "Your site has been closed, please change your site in My account section"
      );
    }
  }, [sites, user.access_level, user.site_id]);
};
