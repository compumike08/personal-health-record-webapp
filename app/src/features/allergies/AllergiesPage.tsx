import { useState } from "react";
import { createSelector } from "@reduxjs/toolkit";
import { Col, Container, Row } from "react-bootstrap";
import { useAppSelector } from "../../hooks";
import { RootState } from "../../store";
import AllergiesList from "./AllergiesList";
import NewUpdateAllergy from "./NewUpdateAllergy";

const AllergiesPage = () => {
  const [selectedCurrentAllergyUuid, setSelectedCurrentAllergyUuid] = useState<
    string | null
  >(null);

  const selectAllergiesList = (state: RootState) =>
    state.allergiesData.allegiesList;
  const selectCurrentAllergyUuid = (
    _state: RootState,
    currentAllergyUuid: string | null
  ) => currentAllergyUuid;

  const selectCurrentAllergy = createSelector(
    [selectAllergiesList, selectCurrentAllergyUuid],
    (allergyList, currentAllergyUuid) => {
      if (currentAllergyUuid === null) {
        return null;
      }

      const index = allergyList.findIndex(
        (alrgy) => alrgy.allergyUuid === currentAllergyUuid
      );
      return allergyList[index];
    }
  );

  const currentAllergy = useAppSelector((state) =>
    selectCurrentAllergy(state, selectedCurrentAllergyUuid)
  );

  const onUpdateAllergy = (allergyUuid: string) => {
    setSelectedCurrentAllergyUuid(allergyUuid);
  };

  const submitComplete = () => {
    setSelectedCurrentAllergyUuid(null);
  };

  return (
    <Container>
      <Row>
        <Col>
          <div className="glbl-heading">Allergies</div>
        </Col>
      </Row>
      <Row>
        <Col md="6" className="mb-4">
          <NewUpdateAllergy
            currentAllergy={currentAllergy}
            isUpdate={currentAllergy !== null}
            submitComplete={
              currentAllergy !== null ? submitComplete : undefined
            }
          />
        </Col>
        <Col md="6">
          <AllergiesList onUpdateAllergy={onUpdateAllergy} />
        </Col>
      </Row>
    </Container>
  );
};

export default AllergiesPage;
