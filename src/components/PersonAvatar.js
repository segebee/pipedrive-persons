/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-27 12:07:00
 * @modify date 2019-01-07 16:37:20
 * @desc display a person avatar
 */
import React from "react";
import { Image } from "semantic-ui-react";
import PropTypes from "prop-types";
import TextAvatar from "./TextAvatar";

const PersonAvatar = props => {
  const {
    person,
    size,
    style,
    fontSize,
    circleHeight,
    circleWidth,
    textHeight,
    textWidth
  } = props;
  if (person === null) return false;

  const avatar = person.picture_id ? true : false;
  const pictureSize = size === "mini" ? 128 : 512;

  return (
    <React.Fragment>
      {avatar && (
        <Image
          size={size}
          src={person.picture_id.pictures[pictureSize]}
          circular
          style={style}
        />
      )}

      {!avatar && (
        <TextAvatar
          first_name={person.first_name}
          last_name={person.last_name}
          style={style}
          fontSize={fontSize}
          circleHeight={circleHeight}
          circleWidth={circleWidth}
          textHeight={textHeight}
          textWidth={textWidth}
        />
      )}
    </React.Fragment>
  );
};

PersonAvatar.propTypes = {
  person: PropTypes.object.isRequired
};

PersonAvatar.defaultProps = {
  person: null,
  style: {}
};

export default PersonAvatar;
