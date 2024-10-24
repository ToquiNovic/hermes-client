import PacmanLoader from "react-spinners/PacmanLoader";

const Spinner = () => (
  <div className="flex flex-col items-center justify-center min-h-screen">
    <PacmanLoader color={"#36d7b7"} size={50} />
    <p className="mt-4 text-lg">El backend se está iniciando, por favor espera</p>
  </div>
);

export default Spinner;