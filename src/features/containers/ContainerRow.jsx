import styled from "styled-components";
import toast from "react-hot-toast";
import CreateContainerForm from "./CreateContainerForm";
import { HiTrash, HiSquare2Stack, HiPencil } from "react-icons/hi2";
import { useDeleteContainer } from "./useDeleteContainer";
import { useCreateContainer } from "./useCreateContainer";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Table from "../../ui/Table";
import Menus from "../../ui/Menus";
import { useEffect, useState } from "react";
import Button from "../../ui/Button";
import { apiKey } from "../../utils/constants";
import {
  determineAvailability,
  formatAPIDate,
  manualOrAPIOverwrite,
  trimPort,
  trimSize,
} from "../../utils/helpers";
import ContainerDetailRow from "./ContainerDetailRow";
import Tag from "../../ui/Tag";

const Container = styled.div`
  font-size: 2.3rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: sans-serif;
`;

const SubContainer = styled.div`
  font-size: 1.4rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: sans-serif;
`;

const Img = styled.img`
  display: block;
  width: 5rem;
  aspect-ratio: 3 / 2;
  object-fit: scale-down;
  object-position: center;
  transform: scale(1.5);
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

const Stacked2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;

  & span:first-child {
    font-weight: 500;
  }

  /* & span:last-child {
    color: var(--color-grey-500);
    font-size: 1.2rem;
  } */
`;

function ContainerRow({ container, token, direction, country }) {
  const { isDeleting, deleteContainer } = useDeleteContainer();
  const { isCreating, createContainer } = useCreateContainer();
  const [isDetailed, setIsDetailed] = useState(false);
  const [containerData, setContainerData] = useState({});
  const [holdsData, setHoldsData] = useState({});

  const {
    id: containerId,
    containerNumber,
    size,
    cargoType,
    aqisEntry,
    vessel,
    etaAvailability,
    discharge,
    timeslot,
    wharf,
    siteLocation,
    client,
    product,
    quantity,
    user,
    image,
    file,
    activeStatus,
    dehire,
    dehireLocation,
    dehireTransport,
    notes,
    bio,
    ifip,
    bioDate,
    ifipDate,
    ifipRequested,
    bioRequested,
  } = container;

  // API CONTAINER DATA CALL
  // useEffect(() => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("x-api-key", apiKey);
  //   myHeaders.append("Authorization", `Bearer ${token}`);

  //   var requestOptions = {
  //     method: "GET",
  //     headers: myHeaders,
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `https://connect.1-stop.biz/tracking/v1/transportEquipment/${containerNumber}/details?direction=${direction}&country=${country}`,
  //     requestOptions
  //   )
  //     .then((res) => res.json())
  //     .then((data) => setContainerData(data))
  //     .catch((error) => console.log("error", error));
  // }, [containerNumber, direction, country, token]);

  // HOLDS DATA API CALL
  // useEffect(() => {
  //   var myHeaders = new Headers();
  //   myHeaders.append("x-api-key", apiKey);
  //   myHeaders.append("Authorization", `Bearer ${token}`);

  //   var requestOptions = {
  //     method: "GET",
  //     headers: myHeaders,
  //     redirect: "follow",
  //   };

  //   fetch(
  //     `https://connect.1-stop.biz/tracking/v1/transportEquipment/${containerNumber}/holds?IMO=${containerData?.equipmentJourney?.vesselVoyage?.IMO}&voyage=${containerData?.equipmentJourney?.vesselVoyage?.inVoyage}`,
  //     requestOptions
  //   )
  //     .then((response) => response.json())
  //     .then((result) => setHoldsData(result))
  //     .catch((error) => console.log("error", error));
  // }, [containerNumber, token, containerData]);

  // console.log(holdsData[0]);

  // console.log(containerNumber, containerData);
  // NOTES

  function handleDuplicate() {
    // Create container custom hook is used here
    createContainer({
      containerNumber: `Copy of ${containerNumber}`,
      size,
      cargoType,
      aqisEntry,
      vessel,
      etaAvailability,
      discharge,
      timeslot,
      wharf,
      siteLocation,
      client,
      product,
      quantity,
      user,
      image,
      file,
      notes,
      bio,
      ifip,
      bioDate,
      ifipDate,
      ifipRequested,
      bioRequested,
    });
    toast.success("Container duplicated");
  }

  function handleDetailed() {
    setIsDetailed(!isDetailed);
  }

  // MANUAL OR API
  let sizeData = manualOrAPIOverwrite(
    size,
    containerData?.equipmentAttribute?.isoCode
  );
  let sizeDisplay = trimSize(sizeData.value);

  let cargoTypeDisplay = manualOrAPIOverwrite(
    cargoType,
    containerData?.cargoAttribute?.cargoType
  );

  let vesselDisplay = manualOrAPIOverwrite(
    vessel,
    containerData?.equipmentJourney?.vesselVoyage?.name
  );

  let etaAvailabilityDisplay = determineAvailability(
    etaAvailability,
    containerData?.equipmentJourney?.vesselVoyage?.estimatedArrival,
    containerData?.equipmentJourney?.vesselVoyage?.actualArrival,
    containerData?.equipmentJourney?.vesselVoyage?.importAvailibility
  );

  let portData = manualOrAPIOverwrite(
    wharf,
    containerData?.equipmentJourney?.destinationPortFacility?.commonName
  );
  let portDisplay = trimPort(portData.value);

  // console.log(portDisplay);

  const newDate = {
    ...etaAvailabilityDisplay,
    value: formatAPIDate(etaAvailabilityDisplay.value),
  };

  // Tags
  const holdToTagName = {
    HELD: "red",
    CLEAR: "green",
  };

  const cargoTypeToTagName = {
    GENERAL: "grey",
    REEFER: "blue",
  };

  const aqisToTagName = {
    NONE: "grey",
    REQUIRED: "red",
    PENDING: "yellow",
    CONFIRMED: "green",
  };

  //   grossWeight colour code
  // > 18 ton green
  // > 25 ton yellow
  // > 28 ton orange
  // > 30 ton red

  function grossLabel(weight) {
    if ("18000" > weight) {
      return "Feather";
    } else if (weight > "18000" && "25000" > weight) {
      return "Light";
    } else if (weight > "25000" && "28000" > weight) {
      return "Medium";
    } else if (weight > "28000") {
      return "Heavy";
    }
  }

  const grossWeightLabel = grossLabel(
    containerData?.cargoAttribute?.grossWeight
  );

  // console.log(containerData?.cargoAttribute?.grossWeight, grossWeightLabel);

  const grossToTagName = {
    Feather: "indigo",
    Light: "green",
    Medium: "yellow",
    Heavy: "red",
  };
  // CONTAINER DETAIL OBJECT
  // NOTE

  //CONTAINER HOLD STATUS OBJECTS
  const holds = [
    { label: "biosecurity", value: holdsData[0]?.biosecurity?.status },
    { label: "customs", value: holdsData[0]?.customs?.status },
    { label: "facility", value: holdsData[0]?.facility?.status },
    { label: "line", value: holdsData[0]?.line?.status },
  ];

  //TODO
  // Make available and unavailable calls
  return (
    <>
      <Table.Row>
        {/* {image.length > 0 ? <Img src={image} /> : <span>{client}</span>} */}
        <Stacked>
          <Container>{containerNumber}</Container>
          <span>
            <Tag type={cargoTypeToTagName[cargoTypeDisplay.value]}>
              {sizeDisplay} - {cargoTypeDisplay.value}
            </Tag>
          </span>
          {containerData?.equipmentJourney?.physicalEvents[0]?.name ? (
            containerData?.equipmentJourney?.physicalEvents[0]?.name
          ) : (
            <span>&mdash;</span>
          )}
        </Stacked>
        <SubContainer>{notes || <span>&mdash;</span>}</SubContainer>
        <Stacked2>
          {aqisEntry ? (
            <SubContainer>{aqisEntry}</SubContainer>
          ) : (
            <span>&mdash;</span>
          )}

          {bioDate ? (
            <Tag type={aqisToTagName["CONFIRMED"]}>{bioDate}</Tag>
          ) : bio && !bioRequested ? (
            <Tag type={aqisToTagName["REQUIRED"]}>Bio</Tag>
          ) : bio && bioRequested ? (
            <Tag type={aqisToTagName["PENDING"]}>Bio</Tag>
          ) : (
            <span>&mdash;</span>
          )}

          {ifipDate ? (
            <Tag type={aqisToTagName["CONFIRMED"]}>{ifipDate}</Tag>
          ) : ifip && !ifipRequested ? (
            <Tag type={aqisToTagName["REQUIRED"]}>IFIP</Tag>
          ) : ifip && ifipRequested ? (
            <Tag type={aqisToTagName["PENDING"]}>IFIP</Tag>
          ) : (
            <span>&mdash;</span>
          )}
        </Stacked2>
        <Stacked>
          <span>{portDisplay}</span>
          <span>{vesselDisplay.value}</span>
        </Stacked>
        <Stacked>
          <SubContainer>{etaAvailabilityDisplay.label}</SubContainer>
          <SubContainer>{newDate.value}</SubContainer>
        </Stacked>
        <SubContainer>{timeslot?.replace("T", " ") || "-"}</SubContainer>
        {siteLocation ? (
          <SubContainer>{siteLocation}</SubContainer>
        ) : (
          <SubContainer>BCS</SubContainer>
        )}
        <SubContainer>storage date</SubContainer>
        <Stacked>
          <div>
            {quantity || ""}x {product}
          </div>
          <div>{client}</div>
        </Stacked>

        <Stacked>
          <div>{dehire}</div>
          <div>{dehireLocation}</div>
          <div>{dehireTransport}</div>
        </Stacked>
        <SubContainer>
          {holds.map((hold) => (
            <Tag type={holdToTagName[hold.value]} key={hold.label}>
              {hold.label.at(0)}
            </Tag>
          ))}
        </SubContainer>
        <Tag type={grossToTagName[grossWeightLabel]}>
          {containerData?.cargoAttribute?.grossWeight}
        </Tag>
        <div key={containerId}>
          <Modal>
            <Menus.Menu>
              <Menus.Toggle id={containerId} />

              <Menus.List id={containerId}>
                <Menus.Button
                  icon={<HiSquare2Stack />}
                  onClick={() => handleDuplicate()}
                >
                  Duplicate
                </Menus.Button>

                <Modal.Open opens="edit">
                  <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
                </Modal.Open>

                <Modal.Open opens="delete">
                  <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
                </Modal.Open>
              </Menus.List>

              <Modal.Window name="edit">
                <CreateContainerForm containerToEdit={container} />
              </Modal.Window>

              <Modal.Window name="delete">
                <ConfirmDelete
                  resourceName={containerNumber}
                  disabled={isDeleting}
                  onConfirm={() => deleteContainer(containerId)}
                />
              </Modal.Window>
            </Menus.Menu>
          </Modal>
        </div>
        <span>
          <Button variation="secondary" onClick={() => handleDetailed()}>
            Details
          </Button>
        </span>
      </Table.Row>
      {isDetailed && (
        <Table.Row>
          <ContainerDetailRow
            vesselIMO={containerData?.equipmentJourney?.vesselVoyage?.IMO}
            height={containerData?.equipmentAttribute?.height}
            reeferTemp={containerData?.cargoAttribute?.reeferTemperature}
            lineOperator={containerData?.cargoAttribute?.lineOperator}
            originPort={containerData?.equipmentJourney?.originPortFacility}
            billOfLading={containerData?.equipmentJourney?.oceanBillOfLading}
          ></ContainerDetailRow>
        </Table.Row>
      )}
    </>
  );
}

export default ContainerRow;
