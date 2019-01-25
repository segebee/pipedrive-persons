/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-27 12:07:00
 * @modify date 2019-01-07 16:37:20
 * @desc display a person
 */
import React from "react";
import { Card } from "semantic-ui-react";
import { Draggable } from "react-beautiful-dnd";
import PropTypes from "prop-types";
import PersonAvatar from "./PersonAvatar";

const styles = {
  card: {
    width: "100%"
  },
  content: {
    paddingLeft: "20px",
    paddingRight: "20px"
  },
  header: {
    fontSize: 14,
    fontWeight: 700
  },
  companyIcon: {
    marginRight: 5
  },
  person: {
    paddingLeft: "10px",
    paddingRight: "10px",
    marginBottom: "10px"
  },
  avatar: {
    width: 40,
    height: 40
  }
};

const OrgIcon = () => {
  return (
    <svg
      id="icon-sm-organization"
      viewBox="0 0 14 14"
      width="14px"
      height="14px"
    >
      <path d="M2 2h7v12H2V2zm8 3l1.71-1h.58L14 5v9h-4V5zm1 2v1h2V7h-2zm0 4v1h2v-1h-2zm0-2v1h2V9h-2zM3 5v1h2V5H3zm0 2v1h2V7H3zm0 2v1h2V9H3zm0 2v1h2v-1H3zm3-6v1h2V5H6zm0 2v1h2V7H6zm0 2v1h2V9H6zm0 2v1h2v-1H6z" />
    </svg>
  );
};

const getItemStyle = (isDragging, draggableStyle) => ({
  margin: `0 0 10px 0`,
  // change background colour if dragging
  background: isDragging ? "#eee" : "inherit",
  // draggable style
  ...draggableStyle
});

const Person = props => {
  const { person, index, handlePersonClick } = props;
  if (person === null) return false;
  return (
    <Draggable key={person.id} draggableId={person.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div style={styles.person}>
            <Card
              style={getItemStyle(snapshot.isDragging, styles.card)}
              onClick={() => handlePersonClick(person)}
            >
              <Card.Content style={styles.content}>
                <div style={{ float: "right" }}>
                  <PersonAvatar
                    person={person}
                    size="mini"
                    style={styles.avatar}
                  />
                </div>

                <Card.Header style={styles.header}>{person.name}</Card.Header>
                <Card.Meta>
                  <span>
                    <OrgIcon style={styles.companyIcon} />
                  </span>
                  <span>{person.org_name}</span>
                </Card.Meta>
              </Card.Content>
            </Card>
          </div>
        </div>
      )}
    </Draggable>
  );
};

Person.propTypes = {
  person: PropTypes.object.isRequired
};

Person.defaultProps = {
  person: null
};

export default Person;
