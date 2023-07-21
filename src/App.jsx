import "./App.scss";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Header, getDate } from "./Header";
import { Collapse, Select, Form } from "antd";
import { SheetRow } from "./SheetRow";

function App() {
  const [sheet, setSheet] = useState([]);
  const [startOptions, setStartOptions] = useState([]);
  const [endOptions, setEndOptions] = useState([]);
  const [ownerOptions, setOwnerOptions] = useState([]);
  const [values, setValues] = useState({});
  const ref = useRef();

  const getSheet = async () => {
    const res = await axios.get(
      "https://sheet.best/api/sheets/ede9eee4-a56f-4d08-9500-577b3cebeb6d"
    );

    const sheets = [];
    const keys = Object.values(res?.data?.[0])?.slice(0, 10);
    let el = {};
    const startDate = [];
    const endDate = [];
    const owners = [];
    for (const elem of res?.data) {
      if (["Task", "FE", "BE", "Bugs"].includes(elem?.[0])) {
        if (["Task", "Bugs"].includes(elem?.[0])) {
          const tasks = Object.values(elem);
          el = {};
          // eslint-disable-next-line no-loop-func
          keys.forEach((_, ind) => (el[keys[ind]] = tasks[ind]));
          el.children = [];
          sheets.push(el);
        } else {
          const subTasks = Object.values(elem);
          const child = {};
          keys.forEach((k, ind) => {
            child[keys[ind]] = subTasks[ind];
            if (keys[ind] === "Start Date") {
              const date = getDate(subTasks[ind]);
              date !== "Invalid date" && startDate.push(date);
            } else if (keys[ind] === "End Date") {
              const date = getDate(subTasks[ind]);
              date !== "Invalid date" && endDate.push(date);
            } else if (keys[ind] === "Owner") {
              owners.push(subTasks[ind]);
            }
          });
          el.children = [...(el?.children || []), child];
        }
      } else if (elem?.[0] === "Others") {
        break;
      } else continue;
    }

    const sd = [...new Set(startDate)];
    const ed = [...new Set(endDate)];
    const own = [...new Set(owners)];

    localStorage.setItem("sheets", JSON.stringify(sheets));
    localStorage.setItem("sd", JSON.stringify(sd));
    localStorage.setItem("ed", JSON.stringify(ed));
    localStorage.setItem("own", JSON.stringify(own));

    // const sheets = JSON.parse(localStorage.getItem("sheets"));
    // const sd = JSON.parse(localStorage.getItem("sd"));
    // const ed = JSON.parse(localStorage.getItem("ed"));
    // const own = JSON.parse(localStorage.getItem("own"));

    setStartOptions(sd);
    setEndOptions(ed);
    setOwnerOptions(own);
    setSheet(sheets);
  };

  useEffect(() => {
    getSheet();
  }, []);

  const getArray = (children) => {
    return children?.filter((s) => {
      if (
        !!values?.owner?.length &&
        s.Owner &&
        !values?.owner?.includes(s.Owner)
      )
        return false;
      if (
        !!values?.startDate?.length &&
        s["Start Date"] &&
        !values?.startDate?.some(
          (d) => d && getDate(d) === getDate(s["Start Date"])
        )
      )
        return false;
      if (
        !!values?.endDate?.length &&
        (!s["End Date"] ||
          !values?.endDate?.some(
            (d) => d && getDate(d) === getDate(s["End Date"])
          ))
      )
        return false;
      return true;
    });
  };

  return (
    <div className="App">
      <h1 style={{ textAlign: "center" }}>STAND UP SHEET (Sprint 14/2)</h1>
      <Form
        ref={ref}
        layout="vertical"
        style={{ display: "flex", justifyContent: "space-between" }}
        onValuesChange={(val) => setValues((prev) => ({ ...prev, ...val }))}
      >
        <Form.Item name="startDate" label="Start Date">
          <Select mode="multiple" size="large" style={{ width: "250px" }}>
            {startOptions?.map((date) => (
              <Select.Option value={date}>{date}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="owner" label="Owners">
          <Select mode="multiple" size="large" style={{ width: "250px" }}>
            <Select.Option value={""}>{""}</Select.Option>
            {ownerOptions?.map((owner) => (
              <Select.Option value={owner}>{owner}</Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="endDate" label="End Date">
          <Select mode="multiple" size="large" style={{ width: "250px" }}>
            {endOptions?.map((date) => (
              <Select.Option value={date}>{date}</Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
      <Collapse
        defaultActiveKey={0}
        accordion
        expandIconPosition="end"
        className="tasks"
      >
        {sheet
          ?.filter((sh) => !!getArray(sh.children)?.length)
          .map((sh, i) => (
            <Collapse.Panel
              header={
                <Header
                  name={sh.Owner}
                  taskName={sh["Main Feature"]}
                  owners={ownerOptions}
                />
              }
              key={i}
            >
              <div className="subtasks">
                {getArray(sh.children)?.map((row) => (
                  <SheetRow
                    key={row["Main Feature"] + sh["Main Feature"]}
                    sheetRow={row}
                    owners={ownerOptions}
                  />
                ))}
              </div>
            </Collapse.Panel>
          ))}
      </Collapse>
    </div>
  );
}

export default App;
