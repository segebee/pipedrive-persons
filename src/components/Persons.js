/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-27 12:07:00
 * @modify date 2019-01-07 16:37:20
 * @desc fetch persons fron api, display them, handle ordering, deletion and general functionalities
 */
import React, { Component } from "react";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import {
  getAllPersons,
  getAllPersonFields,
  findPersons,
  getPerson,
  storePersonOrder,
  deletePerson
} from "../helpers/api";
import Person from "./Person";
import {
  Header,
  Divider,
  Loader,
  Button,
  Input,
  Confirm
} from "semantic-ui-react";
import Logo from "../logo";
import {
  prevPage,
  nextPage,
  switchPage,
  firstPage,
  lastPage
} from "../helpers/pagination/PaginationHelper";
import PaginationRenderer from "../helpers/pagination/PaginationRenderer";
import PersonModal from "./PersonModal";
import CreatePersonModal from "./CreatePersonModal";

const styles = {
  personsList: {
    marginBottom: 20
  },
  header: {
    backgroundColor: "#000",
    height: "40px",
    padding: "10px"
  },
  subheader: {
    paddingLeft: "10px",
    paddingTop: "10px",
    width: "80%",
    display: "inline-block",
    marginBottom: 0
  },
  searchBox: {
    float: "right",
    display: "inline-block",
    marginBottom: 10
  },
  person: {
    paddingLeft: "10px",
    paddingRight: "10px",
    marginBottom: "10px"
  },
  divider: {
    clear: "both"
  },
  createButton: {
    marginRight: 10
  },
  noRecords: {
    marginLeft: 10
  },
  personsGutter: {
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    marginTop: 10
  },
  personsActions: {
    marginBottom: 10
  }
};

// reorder the persons array in state
const reorder = (persons, draggedElementIndex, destinationElementIndex) => {
  // generate an array from persons
  const result = Array.from(persons);
  // remove the element that is being dragged from persons using the index
  const [draggedElement] = result.splice(draggedElementIndex, 1);
  // add the element that is being dragged to persons using the index of the destination element
  result.splice(destinationElementIndex, 0, draggedElement);
  return result;
};

class Persons extends Component {
  state = {
    persons: [],
    filteredPersons: [],
    error: false,
    showModal: false,
    showCreatePersonModal: false,
    showDeletePersonModal: false,
    person: {},
    fields: [],
    loading: false,
    searchKeyword: null,
    start: 0,
    limit: 10,
    total_count: 10,
    currentPage: 1,
    limitUpdated: false,
    orderStoreDelay: 3000
  };

  componentDidMount = async () => {
    // retrieve people from api
    const { start, limit } = this.state;
    await this.fetchAllPersons(start, limit);
    // get person fields
    await this.fetchAllPersonFields();
  };

  componentDidUpdate = async (prevProps, prevState) => {
    // do nothing if the start parameter is unchanged
    const { start, limit } = this.state;
    if (start === prevState.start) return false;
    // fetch data as the start param has changed in state
    await this.fetchAllPersons(start, limit);
  };

  fetchAllPersons = async (start = null, limit = null) => {
    this.setState({ loading: true });
    if (start === null) start = this.state.start;
    if (limit === null) limit = this.state.limit;
    try {
      let persons = await getAllPersons(start, limit);
      // if an error occured, update the state error property
      if (persons.err) return this.setState({ error: true, loading: false });
      // if no data returned, handle such case
      if (!persons.data) {
        this.setState({ persons: [], loading: false });
        return false;
      }
      // get total count for use in pagination
      // console.log("additional_data", persons.additional_data);
      const total_count = persons.additional_data
        ? persons.additional_data.summary.total_count
        : 0;
      // extract person data
      persons = persons.data;
      const filteredPersons = [];
      const key = await this.getCustomFieldKey("order");
      persons.map(person => {
        // check if custom index is set for the person, else add to array
        const order = parseInt(person[key]);
        if (!Number.isNaN(order)) {
          return (filteredPersons[order] = person);
        } else {
          return filteredPersons.push(person);
        }
      });

      // set persons data in state
      const currentPage = Math.ceil(start / limit) + 1;
      return this.setState({
        start,
        persons,
        filteredPersons,
        loading: false,
        total_count,
        currentPage
      });
    } catch (e) {
      console.log("error fetching persons", e);
    }
  };

  fetchAllPersonFields = async () => {
    try {
      const fields = await getAllPersonFields();
      this.setState({ fields });
      return fields;
    } catch (e) {
      console.log("error fetching fields", e);
    }
  };

  getCustomFieldKey = async name => {
    // get custom field key
    let { fields } = this.state;
    if (fields.length < 1) fields = await this.fetchAllPersonFields();
    // get field key using field name
    const customField = fields.filter(field => field.name === name);
    const key = customField[0] ? customField[0].key : null;
    return key;
  };

  handlePersonClick = person => {
    this.setState({ showModal: true, person });
  };

  handleSearchInput = async event => {
    let { persons, filteredPersons } = this.state;
    const searchKeyword = event.target.value.trim().toLowerCase();
    this.setState({ searchKeyword, loading: true });

    // filter the persons list
    filteredPersons = persons.filter((person, index) => {
      // check if the search key work can be found in the person fields the user can see ie name and organization
      if (
        person.name.toLowerCase().indexOf(searchKeyword) > -1 ||
        person.org_name.toLowerCase().indexOf(searchKeyword) > -1
      )
        return true;
      return false;
    });
    this.setState({ filteredPersons });
    // do a server search
    if (searchKeyword.length > 1) {
      const searchResult = await this.serverSearch(searchKeyword);
      this.setState({ filteredPersons: searchResult });
    }

    this.setState({ loading: false });
  };

  serverSearch = async keyword => {
    // search server using keyword
    if (keyword.length < 2) return false;
    try {
      const persons = await findPersons(keyword);
      if (!persons) return false;
      // create a new array by fetching person full data from the server. this is the expected data format for a person
      const personsDetails = await Promise.all(
        persons.map(async person => {
          // get person data
          const personDetails = await getPerson(person.id);
          // console.log({ personDetails });
          return personDetails;
        })
      );
      return personsDetails;
    } catch (e) {
      console.log("error fetching fields", e);
    }
  };

  handleLimitChange = async event => {
    let { start, persons, total_count } = this.state;
    const limit = parseInt(event.target.value);
    // if user wants to show more records than currently displayed, lets fetch from the server
    if (limit > persons.length - 1) {
      // if user selects all records, reset the start
      if (limit === total_count) start = 0;
      await this.fetchAllPersons(start, limit);
    }
    const currentPage = Math.ceil(start / limit) + 1;
    this.setState({ start, limit, limitUpdated: true, currentPage });
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  closeCreatePersonModal = () => {
    this.setState({ showCreatePersonModal: false });
  };

  handleCreatePerson = () => {
    this.setState({ showCreatePersonModal: true });
  };

  handleConfirmDelete = async () => {
    const id = this.state.person.id;
    // remove person from persons in state
    const persons = this.state.persons;
    const newPersons = this.state.persons.filter(person => person.id !== id);
    this.setState({
      showDeletePersonModal: false,
      persons: newPersons,
      filteredPersons: newPersons,
      total_count: this.state.total_count - 1
    });
    try {
      const response = await deletePerson(id);
      // console.log({ response });

      if (response.id) {
        // notify user record deleted successfully
        toast.success("Person deleted successfully", {
          position: toast.POSITION.BOTTOM_LEFT
        });

        // handle the scenario where all records on page are deleted but other pages have records
        const { limit } = this.state;
        const start =
          this.state.start - limit > -1
            ? this.state.start - limit
            : this.state.start + limit;
        // fetch new records if no records left
        if (newPersons.length === 0) this.fetchAllPersons(start, limit);
      } else {
        // notify user record not deleted and reverse optimistic updates
        toast.error("Person not deleted", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        this.setState({ persons, total_count: this.state.total_count + 1 });
      }
    } catch (e) {
      console.log("error deleting person", e);
    }
  };

  handleCancelDelete = async () => {
    this.setState({ showDeletePersonModal: false });
  };

  deletePersonAccount = () => {
    this.setState({ showModal: false, showDeletePersonModal: true });
  };

  onDragEnd = async result => {
    const { destination, source } = result;
    // do nothing if dropped outside the persons list
    if (!destination) {
      return false;
    }
    // do nothing if item being dragged is returned to original position
    if (destination.index === source.index) {
      return false;
    }

    const sourceIndex = source.index;
    const destinationIndex = destination.index;

    const filteredPersons = reorder(
      this.state.filteredPersons,
      sourceIndex,
      destinationIndex
    );

    await this.setState({
      filteredPersons
    });

    // save the reorder positions to the server
    // create an array of current person ids and indexes
    let personIndices = this.state.filteredPersons.map((person, index) => {
      if (!person) return null;
      return {
        id: person.id,
        index
      };
    });
    personIndices = personIndices.filter(personIndex => personIndex !== null);

    // for each item, save the current index using the id. throttle the function to reduce network requests
    clearTimeout(this.throttle);
    this.throttle = setTimeout(
      () => this.saveListOrder(personIndices, this.savePersonOrder),
      this.state.orderStoreDelay
    );
  };

  saveListOrder = (personIndices, savePersonOrder) => {
    personIndices.forEach(({ id, index }) => {
      savePersonOrder(id, index);
    });
  };

  savePersonOrder = async (id, order) => {
    // get custom field key for persons ordering
    const { fields } = this.state;
    const orderFieldName = "order";
    // get field key using field name
    const orderField = fields.filter(field => field.name === orderFieldName);
    const key = orderField[0] ? orderField[0].key : null;
    const data = {
      [key]: order
    };
    // save order on server
    await storePersonOrder(id, data);
  };

  render() {
    let {
      filteredPersons,
      person,
      fields,
      error,
      showModal,
      showCreatePersonModal,
      showDeletePersonModal,
      loading,
      searchKeyword,
      start,
      limitUpdated,
      limit,
      total_count,
      currentPage
    } = this.state;

    const isMobile = window.outerWidth < 768;
    // handle the case where the user changes the limit/records to be shown
    if (limitUpdated) filteredPersons = filteredPersons.slice(0, limit);

    return (
      <div id="personsList" style={styles.personsList}>
        <Header style={styles.header}>
          <Logo />
        </Header>
        <div>
          <Header as="h3" style={styles.subheader}>
            People's List
          </Header>
          <Input
            placeholder="Search..."
            icon="search"
            size="tiny"
            style={styles.searchBox}
            onChange={this.handleSearchInput}
          />
        </div>

        <Divider style={styles.divider} />

        <div align="right" style={styles.personsActions}>
          <Button
            content="Create Person"
            icon="plus"
            color="green"
            labelPosition="right"
            style={styles.createButton}
            onClick={this.handleCreatePerson}
          />
        </div>

        {loading && <Loader active inline="centered" />}

        {error && <div>An error occured retrieving persons. </div>}

        {!error &&
          !loading &&
          filteredPersons.length < 1 && (
            <div style={styles.noRecords}>No persons record found. </div>
          )}

        <DragDropContext
          onBeforeDragStart={this.onBeforeDragStart}
          onDragStart={this.onDragStart}
          onDragUpdate={this.onDragUpdate}
          onDragEnd={this.onDragEnd}
        >
          <Droppable droppableId="droppable">
            {(provided, snapshot) => (
              <div ref={provided.innerRef}>
                {filteredPersons &&
                  filteredPersons.map((person, index) => {
                    if (!person) return false;
                    return (
                      <Person
                        key={person.id}
                        person={person}
                        index={index}
                        handlePersonClick={this.handlePersonClick}
                      />
                    );
                  })}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        {!searchKeyword && (
          <div id="pagination-container" style={styles.personsGutter}>
            <PaginationRenderer
              isMobile={isMobile}
              totalrecords={total_count}
              pageCount={10}
              currentPage={currentPage}
              start={start}
              limit={limit}
              prevPage={prevPage.bind(this)}
              nextPage={nextPage.bind(this)}
              firstPage={firstPage.bind(this)}
              lastPage={lastPage.bind(this)}
              switchPage={switchPage.bind(this)}
              recordType="people"
              recordTypeSingular="person"
              handleLimitChange={this.handleLimitChange}
              separator="..."
            />
            <div className="clear" />
          </div>
        )}

        {showModal && (
          <PersonModal
            person={person}
            fields={fields}
            closeModal={this.closeModal}
            deletePerson={this.deletePersonAccount}
          />
        )}

        {showCreatePersonModal && (
          <CreatePersonModal
            closeModal={this.closeCreatePersonModal}
            fetchAllPersons={this.fetchAllPersons}
            fields={fields}
          />
        )}

        {showDeletePersonModal && (
          <Confirm
            open
            size="tiny"
            content="Are you sure you want to delete this person?"
            onCancel={this.handleCancelDelete}
            onConfirm={this.handleConfirmDelete}
          />
        )}

        <ToastContainer autoClose={3000} />
      </div>
    );
  }
}

export default Persons;
