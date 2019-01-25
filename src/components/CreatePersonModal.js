/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-27 12:07:00
 * @modify date 2019-01-07 16:37:20
 * @desc create a person
 */
import React, { Component } from "react";
import {
  Modal,
  Button,
  Input,
  Message,
  Icon,
  Form,
  Search
} from "semantic-ui-react";
import {
  getOrganizations,
  createPerson,
  createOrganization
} from "../helpers/api";

const styles = {
  closeButton: {
    boxShadow: "none",
    padding: 0,
    marginTop: 3
  },
  backButton: {
    boxShadow: "0 0 2px 1px #ccc",
    padding: "7px 20px"
  },
  createButton: {
    margin: "7px 0"
  },
  actions: {
    padding: ".5rem .5rem"
  },
  personName: {
    marginTop: 10
  },
  personPhone: {
    color: "#69F294"
  },
  modalHeader: {
    fontSize: 14,
    backgroundColor: "#efefef",
    border: "1px solid #eee",
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
    paddingBottom: "5px",
    width: "100%"
  },
  label: {
    width: "100%",
    display: "inline-block",
    fontWeight: "700",
    color: "#666666",
    marginBottom: "5px"
  }
};

class CreatePersonModal extends Component {
  state = {
    name: "",
    email: "",
    phone: "",
    org_name: "",
    assistant: "",
    groups: "",
    location: "",
    creating: false,
    success: false,
    error: false,
    message: "",
    nameError: false,
    emailError: false,
    phoneError: false,
    isSearching: false,
    organizations: [],
    org_id: null,
    groupsField: null,
    assistantField: null,
    locationField: null
  };

  componentDidMount() {
    // check for custome fields
    const customFields = ["Groups", "Assistant", "Location"];
    const customPersonFields = this.props.fields.filter(field =>
      customFields.includes(field.name)
    );

    const groupsField = customPersonFields.filter(
      field => field.name === "Groups"
    )[0];
    const assistantField = customPersonFields.filter(
      field => field.name === "Assistant"
    )[0];
    const locationField = customPersonFields.filter(
      field => field.name === "Location"
    )[0];
    this.setState({ groupsField, assistantField, locationField });
  }

  handleChange = (e, { name, value }) => {
    this.setState({ [name]: value });
    const errorField = `${name}Error`;
    if (value === "") {
      this.setState({ [errorField]: true });
    } else {
      this.setState({ [errorField]: false });
    }
  };

  resetComponent = () =>
    this.setState({ isSearching: false, organizations: [] });

  handleSearchChange = async (e, { value }) => {
    this.setState({ isSearching: true, org_name: value });
    if (value.length < 2) return this.resetComponent();
    const results = await getOrganizations(value);
    const organizations =
      results &&
      results.map(org => ({
        id: org.id,
        title: org.name
      }));

    this.setState({
      isSearching: false,
      organizations
    });
  };

  handleResultSelect = (e, { result }) =>
    this.setState({ org_id: result.id, org_name: result.title });

  resetForm = () =>
    this.setState({
      error: false,
      success: true,
      message: "Person created successfully",
      name: "",
      email: "",
      phone: "",
      org_id: null,
      org_name: "",
      assistant: "",
      groups: "",
      location: ""
    });

  createPersonAccount = async () => {
    let {
      name,
      email,
      phone,
      org_id,
      org_name,
      assistant,
      groups,
      location,
      groupsField,
      assistantField,
      locationField
    } = this.state;

    if (name === "" || email === "" || phone === "") {
      this.setState({
        success: false,
        error: true,
        message: "Please fill all required fields"
      });
      return false;
    }
    this.setState({ creating: true });
    // check for custom fields
    const groupsObject = groupsField
      ? { key: [groupsField.key], value: groups }
      : null;
    const assistantObject = assistantField
      ? { key: [assistantField.key], value: assistant }
      : null;
    const locationObject = locationField
      ? { key: [locationField.key], value: location }
      : null;

    // create a person using supplied params
    try {
      // create an organizaton and get the id if no org ig set
      if (!org_id) {
        const organization = await createOrganization({
          name: org_name
        });
        if (organization.id) org_id = organization.id;
      }

      let requestData = {
        name,
        email,
        phone,
        org_id
      };

      if (groupsObject) requestData[groupsObject.key] = groupsObject.value;
      if (assistantObject)
        requestData[assistantObject.key] = assistantObject.value;
      if (locationObject)
        requestData[locationObject.key] = locationObject.value;
      const response = await createPerson(requestData);

      if (response.id) {
        // reset form fields
        this.resetForm();
        // reload records
        this.props.fetchAllPersons();
      } else {
        this.setState({
          success: false,
          error: true,
          message: "Person not created"
        });
      }
    } catch (e) {
      // console.log("error creating person: ", e);
    }

    this.setState({ creating: false });
  };

  render() {
    const { closeModal } = this.props;
    const {
      creating,
      success,
      error,
      message,
      name,
      email,
      phone,
      assistant,
      groups,
      location,
      nameError,
      emailError,
      phoneError,
      isSearching,
      organizations,
      org_name,
      groupsField,
      assistantField,
      locationField
    } = this.state;

    const showAssistant = assistantField ? true : false;
    const showGroups = groupsField ? true : false;
    const showLocation = locationField ? true : false;

    return (
      <Modal size="mini" open={true} onClose={closeModal}>
        <Modal.Header style={styles.modalHeader}>
          Add new person
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
          <Form>
            <Form.Field required error={nameError}>
              <label style={styles.label}>Name</label>
              <Input
                fluid
                onChange={this.handleChange}
                name="name"
                value={name}
              />
            </Form.Field>
            <Form.Field required error={emailError}>
              <label style={styles.label}>Email</label>
              <Input
                fluid
                onChange={this.handleChange}
                name="email"
                value={email}
              />
            </Form.Field>
            <Form.Field required error={phoneError}>
              <label style={styles.label}>Phone</label>
              <Input
                fluid
                onChange={this.handleChange}
                name="phone"
                value={phone}
              />
            </Form.Field>
            <Form.Field required>
              <label style={styles.label}>Organization</label>
              <Search
                loading={isSearching}
                onResultSelect={this.handleResultSelect}
                onSearchChange={this.handleSearchChange}
                results={organizations}
                value={org_name}
              />
            </Form.Field>

            {showAssistant && (
              <Form.Field>
                <label style={styles.label}>Assistant</label>
                <Input
                  fluid
                  onChange={this.handleChange}
                  name="assistant"
                  value={assistant}
                />
              </Form.Field>
            )}
            {showGroups && (
              <Form.Field>
                <label style={styles.label}>Groups</label>
                <Input
                  fluid
                  onChange={this.handleChange}
                  name="groups"
                  value={groups}
                />
              </Form.Field>
            )}
            {showLocation && (
              <Form.Field>
                <label style={styles.label}>Location</label>
                <Input
                  fluid
                  onChange={this.handleChange}
                  name="location"
                  value={location}
                />
              </Form.Field>
            )}

            <div style={styles.createButton}>
              <Button
                disabled={creating}
                fluid
                positive
                onClick={this.createPersonAccount}
              >
                {!creating && <strong>Create</strong>}
                {creating && <Icon name="spinner" loading />}
              </Button>

              {error && (
                <Message negative>
                  <p>{message}</p>
                </Message>
              )}
              {success && (
                <Message positive>
                  <p>{message}</p>
                </Message>
              )}
            </div>
          </Form>
        </Modal.Content>
        <Modal.Actions style={styles.actions}>
          <Button
            style={styles.backButton}
            size="tiny"
            basic
            onClick={closeModal}
          >
            <strong>Back</strong>
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

export default CreatePersonModal;
