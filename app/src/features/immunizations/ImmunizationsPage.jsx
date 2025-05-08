import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSelector } from "@reduxjs/toolkit";
import { Container, Row, Col } from "react-bootstrap";
import { toast } from "react-toastify";
import ImmunizationsList from "./ImmunizationsList";
import NewUpdateImmunization from "./NewUpdateImmunization";
import { deleteImmunizationAction } from "./immunizationsSlice";

const ImmunizationsPage = () => {
  const dispatch = useDispatch();

  const [selectedCurrentImzUuid, setSelectedCurrentImzUuid] = useState(null);

  const selectImmunizationsList = (state) =>
    state.immunizationsData.immunizationsList;

  const selectCurrentImmunizationUuid = (_state, currentImmunizationUuid) =>
    currentImmunizationUuid;

  const selectCurrentImmunization = createSelector(
    [selectImmunizationsList, selectCurrentImmunizationUuid],
    (immunizationsList, currentImmunizationUuid) => {
      if (selectedCurrentImzUuid === null) {
        return null;
      }

      const index = immunizationsList.findIndex(
        (imz) => imz.immunizationUuid === currentImmunizationUuid
      );
      return immunizationsList[index];
    }
  );

  const currentImmunization = useSelector((state) =>
    selectCurrentImmunization(state, selectedCurrentImzUuid)
  );

  const onUpdateImmunization = (immunizationUuid) => {
    setSelectedCurrentImzUuid(immunizationUuid);
  };

  const submitComplete = () => {
    setSelectedCurrentImzUuid(null);
  };

  const onDeleteImmunization = async (immunizationUuid) => {
    try {
      await dispatch(deleteImmunizationAction(immunizationUuid)).unwrap();

      toast.success("Immunization deleted successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Immunizations</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <Row>
            <Col>
              <h6>New Immunization</h6>
            </Col>
          </Row>
          <NewUpdateImmunization
            currentImmunization={currentImmunization}
            isUpdate={currentImmunization !== null}
            submitComplete={
              currentImmunization !== null ? submitComplete : undefined
            }
          />
        </Col>
        <Col md="6">
          <ImmunizationsList
            onUpdateImmunization={onUpdateImmunization}
            onDeleteImmunization={onDeleteImmunization}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default ImmunizationsPage;
