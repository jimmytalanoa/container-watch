import CreateContainerForm from "./CreateContainerForm";
import Button from "../../ui/Button";
import Modal from "../../ui/Modal";

function AddContainer() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="container-form">
          <Button>Add new container</Button>
        </Modal.Open>
        <Modal.Window name="container-form">
          <CreateContainerForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}

// function AddContainer() {
//   const [isOpenModal, setIsOpenModal] = useState(false);

//   function handleShowForm() {
//     setIsOpenModal((show) => !show);
//   }
//   return (
//     <div>
//       <Button onClick={handleShowForm}>Add new Container</Button>
//       {isOpenModal && (
//         <Modal onClose={() => setIsOpenModal(false)}>
//           <CreateContainerForm onCloseModal={() => setIsOpenModal(false)} />
//         </Modal>
//       )}
//     </div>
//   );
// }

export default AddContainer;
