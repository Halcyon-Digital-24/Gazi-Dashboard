import Swal from "sweetalert2";

const Modal = async (onClick: () => void) => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    showCloseButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, Requested!",
  }).then((result) => {
    if (result.isConfirmed) {
      onClick();

      Swal.fire("Requested!", "Please Wait for a Second.", "success");
    }
  });
};

export default Modal;
