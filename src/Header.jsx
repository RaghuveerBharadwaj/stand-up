import React from "react";
import moment from "moment";

export const Header = ({ name, taskName, color, owners }) => {
  const initials = (name || "")
    ?.split(" ")
    ?.map((sp) => sp.charAt(0).toUpperCase())
    ?.join("");
  return (
    <div className="task-header">
      <span style={{ backgroundColor: getColor(name, owners) }} title={name}>
        {initials}
      </span>
      <p style={{ color }}> {taskName} </p>
    </div>
  );
};

const colors = [
  "#FF6633",
  "#FFB399",
  "#FF33FF",
  "#00B3E6",
  "#E6B333",
  "#3366E6",
  "#999966",
  "#99FF99",
  "#B34D4D",
  "#80B300",
  "#809900",
  "#E6B3B3",
  "#6680B3",
];

const getColor = (name, owners) => {
  for (let index = 0; index < owners.length; index++) {
    if (name === owners[index]) {
      return colors[index];
    }
  }
  return "#FFF";
};

export const getDate = (date) =>
date ? moment(date?.replace(" ", ""))?.format("DD MMMM") : null;
