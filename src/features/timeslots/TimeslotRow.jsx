/* eslint-disable react/prop-types */
import styled from "styled-components";
import { format, isToday } from "date-fns";

import Tag from "../../ui/Tag";
import Table from "../../ui/Table";
import { useNavigate } from "react-router-dom";
import { getContainerDetails } from "../../services/apiOneStop";
import { useEffect, useState } from "react";
import { apiKey } from "../../utils/constants";

const Container = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: sans-serif;
`;

const Stacked = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  }
`;

const Timeslot = styled.div`
  font-family: "Sono";
  font-weight: 500;
`;

function TimeslotRow({
  timeslot: {
    container,
    type,
    size,
    full,
    yard_location,
    vessel,
    pin,
    exp_cutoff,
    est_discharge,
    storage_start,
    pool,
    timeslot_date,
    time_zone,
    status,
    comm,
  },
  token,
  direction,
  country,
}) {
  const [containerData, setContainerData] = useState({});
  // API Call to get OneStop Container Data
  // const { equipmentAttribute, cargoAttribute, equipmentJourney } =
  //   getContainerDetails(container, token, country, direction);

  useEffect(() => {
    var myHeaders = new Headers();
    myHeaders.append("x-api-key", apiKey);
    myHeaders.append("Authorization", `Bearer ${token}`);

    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(
      `https://connect.1-stop.biz/tracking/v1/transportEquipment/${container}/details?direction=import&country=AU`,
      requestOptions
    )
      .then((res) => res.json())
      .then((data) => setContainerData(data))
      .catch((error) => console.log("error", error));
  }, []);

  const statusToTagName = {
    Manifested: "green",
    Confirmed: "blue",
  };
  //TODO Shorten Position labels
  //TODO
  // TODO Figure out the tags for the ports
  function trimPortName(port) {
    switch (port) {
      case "VICTORIA INTERNATIONAL CONTAINER TERMINAL":
        return "VICT";
      case "PATRICK, VI, EAST SWANSON":
        return "PAT";
      default:
        return "";
    }
  }

  function trimSize(size) {
    if (size.startsWith("2")) {
      return "20'";
    } else if (size.startsWith("4")) {
      return "40'";
    }
  }

  // TODO Mannual overwrite vesel details

  console.log(container, containerData);

  return (
    <Table.Row>
      <Stacked>
        <Container>{container}</Container>
        <span>
          {trimSize(size)} - {containerData?.cargoAttribute?.cargoType}
        </span>
      </Stacked>

      <span>{containerData?.equipmentAttribute?.equipmentType}</span>

      <span>{containerData?.equipmentJourney?.physicalEvents.at(0).name}</span>

      <span>
        {trimPortName(
          containerData?.equipmentJourney?.destinationPortFacility?.commonName
        )}
      </span>

      <span>{size}</span>

      <span>{comm}</span>

      <Stacked>
        <span>{type}</span>
        <span>{full}</span>
      </Stacked>

      <Stacked>
        <span>
          {isToday(new Date(timeslot_date)) ? "Today" : timeslot_date}
        </span>
      </Stacked>

      <Tag type={statusToTagName[status]}>{status.replace("-", " ")}</Tag>

      <Timeslot>{time_zone}</Timeslot>

      <span>{pin}</span>
    </Table.Row>
  );
}

export default TimeslotRow;
