import React from "react";
import { useAllCyclesOfDoctor } from "../../../hooks/reactquery/queries/cyclesQueries";
import EmptyRow from "../../UI/Tables/EmptyRow";
import LoadingRow from "../../UI/Tables/LoadingRow";
import AllCyclesItem from "./AllCyclesItem";

type AllCyclesResultsProps = {
  search: {
    range_start: number;
    range_end: number;
    site_id: number;
    assigned_md: number;
  };
};

const AllCyclesResults = ({ search }: AllCyclesResultsProps) => {
  const {
    data: cycles,
    error,
    isPending,
  } = useAllCyclesOfDoctor(search.assigned_md);

  if (error) return <div>Error loading cycles</div>;

  const filteredCycles = cycles?.filter((cycle) =>
    search.site_id === -1 ? true : cycle.site_id === search.site_id
  );

  return (
    <div className="allCycles__table-container">
      <table className="allCycles__table">
        <thead>
          <tr>
            <th>Cycle#</th>
            <th>Patient Chart#</th>
            <th>Last Name</th>
            <th>First Name</th>
            <th>Date of birth</th>
            <th>Cycle Type</th>
            <th>Date</th>
            <th>E2 (pmol/L)</th>
            <th>LH (IU/L)</th>
            <th>P4 (ng/mL)</th>
            <th>End</th>
            <th>Left follicles</th>
            <th>Rigth follicles</th>
            <th>Med 1</th>
            <th>Med 2</th>
            <th>Med 3</th>
            <th>Med 4</th>
            <th>Med 5</th>
            <th>Med 6</th>
            <th>Med 7</th>
          </tr>
        </thead>
        <tbody>
          {filteredCycles &&
            (filteredCycles.length > 0
              ? filteredCycles
                  .sort((a, b) =>
                    (
                      a.patient_infos.Names?.LegalName.LastName.Part as string
                    ).localeCompare(
                      b.patient_infos.Names?.LegalName.LastName.Part as string
                    )
                  )
                  .map((cycle) =>
                    cycle.events
                      .filter(
                        (event) =>
                          event.date &&
                          event.date >= search.range_start &&
                          event.date <= search.range_end
                      )
                      .sort((a, b) => (b.date as number) - (a.date as number))
                      .map((event) => (
                        <AllCyclesItem
                          key={cycle.id + (event.date as number).toString()}
                          event={event}
                          cycle={cycle}
                        />
                      ))
                  )
              : !isPending && <EmptyRow colSpan={20} text="No results" />)}
          {isPending && <LoadingRow colSpan={20} />}
        </tbody>
      </table>
    </div>
  );
};

export default AllCyclesResults;
