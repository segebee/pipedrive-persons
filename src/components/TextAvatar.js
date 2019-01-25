/**
 * @author Segun
 * @email segebee@gmail.com
 * @create date 2018-11-27 12:07:00
 * @modify date 2019-01-07 16:37:20
 * @desc display a text avatar
 */
import React from "react";
import PropTypes from "prop-types";

const TextAvatar = props => {
  const {
    first_name,
    last_name,
    style,
    fontSize,
    backgroundColor,
    textColor,
    circleHeight,
    circleWidth,
    textHeight,
    textWidth
  } = props;

  const firstname = first_name || "-";
  const lastname = last_name || "-";

  const initials = `${firstname.charAt(0).toUpperCase()}${lastname
    .charAt(0)
    .toUpperCase()}`;
  return (
    <svg xmlns="http://www.w3.org/2000/svg" style={style}>
      <circle
        cx={circleWidth}
        cy={circleHeight}
        r={circleWidth}
        fill={backgroundColor}
      />
      <text
        x={textWidth}
        y={textHeight}
        textAnchor="middle"
        fill={textColor}
        fontSize={fontSize}
      >
        {initials}
      </text>
    </svg>
  );
};

TextAvatar.propTypes = {
  first_name: PropTypes.string.isRequired,
  last_name: PropTypes.string.isRequired,
  style: PropTypes.object
};
TextAvatar.defaultProps = {
  first_name: "-",
  last_name: "-",
  style: {
    height: 40,
    width: 40
  },
  fontSize: 12,
  backgroundColor: "#B7DCF9",
  textColor: "#0D69B1",
  circleHeight: 20,
  circleWidth: 20,
  textHeight: 25,
  textWidth: 20
};

export default TextAvatar;
