import Filter from "../../ui/Filter";
import SortBy from "../../ui/SortBy";
import TableOperations from "../../ui/TableOperations";

function ContainerTableOperations() {
  return (
    <TableOperations>
      <Filter
        filterField="status"
        options={[
          { value: "all", label: "All" },
          { value: "available", label: "Available" },
          { value: "unavailable", label: "Unavailable" },
        ]}
      />

      <SortBy
        options={[
          { value: "aqis-desc", label: "Sort by AQIS date (latest first)" },
          {
            value: "aqis-asc",
            label: "Sort by AQIS date (earliest first)",
          },
          {
            value: "discharge-desc",
            label: "Sort by Discharge date (latest first)",
          },
          {
            value: "discharge-asc",
            label: "Sort by Discharge date (earliest first)",
          },
          { value: "containerNumber-desc", label: "Sort by Name (Z-A)" },
          { value: "containerNumber-asc", label: "Sort by Name (A-Z)" },
        ]}
      />
    </TableOperations>
  );
}

export default ContainerTableOperations;
