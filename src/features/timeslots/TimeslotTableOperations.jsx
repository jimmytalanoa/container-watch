import SortBy from "../../ui/SortBy";
import Filter from "../../ui/Filter";
import TableOperations from "../../ui/TableOperations";

function TimeslotTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "Manifested", label: "Manifested" },
          { value: "Confirmed", label: "Confirmed" },
        ]}
      />

      <SortBy
        options={[
          { value: "startDate-desc", label: "Sort by date (latest first)" },
          { value: "startDate-asc", label: "Sort by date (earliest first)" },
        ]}
      />
    </TableOperations>
  );
}

export default TimeslotTableOperations;
