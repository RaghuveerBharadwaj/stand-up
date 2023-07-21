import React from "react";
import moment from "moment";
import { Header, getDate } from "./Header";
import { Badge } from "antd";

export const SheetRow = ({ sheetRow, owners }) => {
  const getColor = (status) => {
    switch (status) {
      case "TO DO":
        return "blue";
      case "DONE":
        return "green";
      case "IN REVIEW":
        return "purple";
      case "MISSED SPRINT":
        return "red";
      case "IN PROGRESS":
        return "orange";
      case "IN QA":
        return "lightgreen";
      default:
        return "#000";
    }
  };

  return (
    <Badge.Ribbon
      text={`${sheetRow["Estimates (1day = 8hrs)"]} days`}
      color={getColor(sheetRow.Status)}
    >
      <div className="subtask">
        <Header
          name={sheetRow.Owner}
          taskName={sheetRow.Status}
          owners={owners}
        />
        <p>{sheetRow["Main Feature"]}</p>
      </div>
      <div className="start">{getDate(sheetRow["Start Date"])}</div>
      <div className="end">{getDate(sheetRow["End Date"])}</div>
    </Badge.Ribbon>
  );
};
