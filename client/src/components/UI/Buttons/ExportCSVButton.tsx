import {
  FetchNextPageOptions,
  InfiniteData,
  InfiniteQueryObserverResult,
} from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import { CSVLink } from "react-csv";
import useStaffInfosContext from "../../../hooks/context/useStaffInfosContext";
import useUserContext from "../../../hooks/context/useUserContext";
import { AdminType, BillingType, XanoPaginatedType } from "../../../types/api";
import { UserStaffType } from "../../../types/app";
import { timestampToDateISOTZ } from "../../../utils/dates/formatDates";
import { toExportCSVName } from "../../../utils/files/toExportCSVName";

type ExportCSVButtonProps = {
  billings: BillingType[];
  rangeStart: number;
  rangeEnd: number;
  all: boolean;
  headers: { label: string; key: string }[];
  fetchNextPage: (
    options?: FetchNextPageOptions
  ) => Promise<
    InfiniteQueryObserverResult<
      InfiniteData<XanoPaginatedType<BillingType>, unknown>,
      Error
    >
  >;
  hasNextPage: boolean;
};

const ExportCSVButton = ({
  billings,
  rangeStart,
  rangeEnd,
  all,
  headers,
  fetchNextPage,
  hasNextPage,
}: ExportCSVButtonProps) => {
  const { user } = useUserContext() as { user: AdminType | UserStaffType };
  const { staffInfos } = useStaffInfosContext();
  const [loading, setLoading] = useState(false);
  const [waitingForData, setWaitingForData] = useState(false);
  // Store a reference to the CSVLink component
  const [csvLinkElement, setCsvLinkElement] =
    useState<HTMLAnchorElement | null>(null);

  // Effect to trigger download when all data is loaded and component has re-rendered with new data
  useEffect(() => {
    // If we're waiting for data and we're not fetching anymore, trigger the download
    if (waitingForData && !hasNextPage && !loading && csvLinkElement) {
      // Add a small delay to ensure all data is properly loaded
      const timer = setTimeout(() => {
        csvLinkElement.click();
        setWaitingForData(false);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [waitingForData, hasNextPage, loading, csvLinkElement]);

  // Fonction pour gérer le clic sur le bouton d'export
  const handleExportClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    // Si nous n'avons pas de pages suivantes, on peut télécharger directement
    if (!hasNextPage && csvLinkElement) {
      csvLinkElement.click();
      return;
    }

    // Sinon, on empêche le comportement par défaut et on charge toutes les pages
    e.preventDefault();
    setLoading(true);

    try {
      // Récupérer toutes les pages
      let hasMorePages = true;
      while (hasMorePages) {
        const response = await fetchNextPage();
        hasMorePages = !!response.hasNextPage;
      }

      // Indiquer que nous attendons que toutes les données soient chargées
      setWaitingForData(true);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching all pages:", error);
      setLoading(false);
    }
  };

  return (
    <button className="btn" onClick={handleExportClick} disabled={loading}>
      {loading ? (
        "Preparing export..."
      ) : (
        <CSVLink
          data={billings?.map((billing) => {
            return {
              ...billing,
              date: [
                timestampToDateISOTZ(billing.date)?.split("-")[1],
                timestampToDateISOTZ(billing.date)?.split("-")[2],
                timestampToDateISOTZ(billing.date)?.split("-")[0],
              ].join("-"),
              site_infos: {
                ...billing.site_infos,
                province_state:
                  billing.site_infos?.province_state.split("-")[1],
              },
              patient_infos: {
                ...billing.patient_infos,
                DateOfBirth: [
                  timestampToDateISOTZ(
                    billing.patient_infos?.DateOfBirth
                  )?.split("-")[1],
                  timestampToDateISOTZ(
                    billing.patient_infos?.DateOfBirth
                  )?.split("-")[2],
                  timestampToDateISOTZ(
                    billing.patient_infos?.DateOfBirth
                  )?.split("-")[0],
                ].join("-"),
                Gender:
                  billing.patient_infos?.Gender === "M" ? "Male" : "Female",
              },
              referrer_ohip_billing_nbr:
                billing.referrer_ohip_billing_nbr || "",
              service_quantity: 1,
              billing_infos: {
                ...billing.billing_infos,
                billing_code:
                  billing.billing_infos?.billing_code +
                  billing.billing_code_suffix,
                // billing.billing_infos?.billing_code.length === 4
                //   ? `${billing.billing_infos?.billing_code}A`
                //   : billing.billing_infos?.billing_code,
              },
            };
          })}
          filename={toExportCSVName(
            user?.access_level,
            user?.title || "",
            rangeStart,
            rangeEnd,
            all,
            staffInfos,
            user?.id
          )}
          // target="_blank"
          headers={headers}
          style={{ color: "#3D375A" }}
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ref={(ref: any) => {
            // This callback gives us access to the underlying anchor element
            if (ref && ref.link) {
              setCsvLinkElement(ref.link);
            }
          }}
          enclosingCharacter=""
        >
          Export to CSV
        </CSVLink>
      )}
    </button>
  );
};

export default ExportCSVButton;
