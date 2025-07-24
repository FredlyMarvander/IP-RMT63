import Swal from "sweetalert2";

export default function errorAlert(error) {
  return Swal.fire({
    icon: "error",
    title: "Oops...",
    text: error,
    confirmButtonColor: "#222831",
  });
}
