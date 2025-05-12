import { useState } from "react";
import { createSelector, SerializedError } from "@reduxjs/toolkit";
import { Col, Container, Row } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import ImmunizationsList from "./ImmunizationsList";
import NewUpdateImmunization from "./NewUpdateImmunization";
import { deleteImmunizationAction } from "./immunizationsSlice";

const ImmunizationsPage = () => {
  const dispatch = useAppDispatch();

  const [selectedCurrentImzUuid, setSelectedCurrentImzUuid] = useState<
    string | null
  >(null);

  const selectImmunizationsList = (state: RootState) =>
    state.immunizationsData.immunizationsList;

  const selectCurrentImmunizationUuid = (
    _state: RootState,
    currentImmunizationUuid: string | null
  ) => currentImmunizationUuid;

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

  const currentImmunization = useAppSelector((state) =>
    selectCurrentImmunization(state, selectedCurrentImzUuid)
  );

  const onUpdateImmunization = (immunizationUuid: string) => {
    setSelectedCurrentImzUuid(immunizationUuid);
  };

  const submitComplete = () => {
    setSelectedCurrentImzUuid(null);
  };

  const onDeleteImmunization = async (immunizationUuid: string) => {
    try {
      await dispatch(deleteImmunizationAction(immunizationUuid)).unwrap();

      toast.success("Immunization deleted successfully");
    } catch (err) {
      const error = err as SerializedError;
      toast.error(error.message);
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
              <h6>
                {currentImmunization !== null
                  ? "Update Immunization"
                  : "New Immunization"}
              </h6>
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
