import { useAppSelector } from "../../hooks";
import "./GlobalSpinner.css";

const GlobalSpinner = () => {
  const loading = useAppSelector((state) => state.globalSpinnerData.loading);

  return (
    <>
      {loading && (
        <div className="loading-state">
          <div className="loading"></div>
        </div>
      )}
    </>
  );
};

export default GlobalSpinner;
