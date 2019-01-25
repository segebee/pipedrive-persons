/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-27 12:07:00
 * @modify date 2019-01-07 16:37:20
 * @desc display a person's details
 */
import React from "react";
import { Divider, Modal, Button } from "semantic-ui-react";
import PersonAvatar from "./PersonAvatar";

const styles = {
  closeButton: {
    boxShadow: "none",
    padding: 0,
    marginTop: 3
  },
  backButton: {
    boxShadow: "0 0 2px 1px #ccc",
    padding: "7px 20px",
    borderRadius: 2,
    border: 0
  },
  deleteButton: {
    padding: "7px 20px",
    borderRadius: 2,
    border: 0
  },
  actions: {
    padding: "8px 16px",
    backgroundColor: "#f7f7f7",
    boxShadow: "inset 0 1px 0 0 #e5e5e5",
    textAlign: "left"
  },
  personName: {
    marginTop: 10
  },
  personPhone: {
    color: "#69F294"
  },
  modalHeader: {
    fontSize: 14,
    backgroundColor: "#f7f7f7",
    borderBottom: "1px solid #e5e5e5",
    paddingTop: 15,
    paddingBottom: 15
  },
  divider: {
    clear: "both"
  },
  avatar: {
    width: 80,
    height: 80
  },
  field: {
    padding: "6px 0",
    width: "100%"
  },
  fieldLabel: {
    width: "35%",
    display: "inline-block",
    fontWeight: "700",
    textAlign: "right",
    paddingRight: 20,
    color: "#666666"
  },
  fieldValue: {
    width: "65%",
    wordBreak: "break-all",
    display: "inline-block",
    color: "#aaaaaa",
    fontWeight: "500"
  }
};

const PersonModal = props => {
  const { person, fields, closeModal, deletePerson } = props;
  // filter the fields array to get the keys  for our custom fields
  const customFields = ["Groups", "Assistant", "Location"];
  const customPersonFields = fields.filter(field =>
    customFields.includes(field.name)
  );
  const groupsField = customPersonFields.filter(
    field => field.name === "Groups"
  );
  const assistantField = customPersonFields.filter(
    field => field.name === "Assistant"
  );
  const locationField = customPersonFields.filter(
    field => field.name === "Location"
  );

  return (
    <Modal size="mini" open={true} onClose={closeModal}>
      <Modal.Header style={styles.modalHeader}>
        Person Information
        <Button
          basic
          icon="times"
          size="tiny"
          floated="right"
          onClick={closeModal}
          style={styles.closeButton}
        />
      </Modal.Header>
      <Modal.Content>
        <div align="center">
          <PersonAvatar
            person={person}
            size="small"
            style={styles.avatar}
            fontSize={34}
            circleWidth={40}
            circleHeight={40}
            textWidth={40}
            textHeight={50}
          />
          <div style={styles.personName}>
            <strong>{person.name}</strong>
          </div>
          <div style={styles.personPhone}>
            <strong>{person.phone[0].value}</strong>
          </div>
        </div>

        <Divider />

        <div style={styles.field}>
          <label style={styles.fieldLabel}>Email</label>
          <span style={styles.fieldValue}>{person.email[0].value}</span>
        </div>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Organization</label>
          <span style={styles.fieldValue}>{person.org_name}</span>
        </div>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Assistant</label>
          <span style={styles.fieldValue}>
            {assistantField[0] && person[assistantField[0].key]}
          </span>
        </div>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Groups</label>
          <span style={styles.fieldValue}>
            {groupsField[0] && person[groupsField[0].key]}
          </span>
        </div>
        <div style={styles.field}>
          <label style={styles.fieldLabel}>Location</label>
          <span style={styles.fieldValue}>
            {locationField[0] && person[locationField[0].key]}
          </span>
        </div>
      </Modal.Content>
      <Modal.Actions style={styles.actions}>
        <Button
          style={styles.deleteButton}
          size="tiny"
          content="Delete"
          // icon="times"
          color="red"
          onClick={() => deletePerson(person)}
        />

        <Button
          style={styles.backButton}
          size="tiny"
          basic
          floated="right"
          onClick={closeModal}
        >
          Back
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default PersonModal;
