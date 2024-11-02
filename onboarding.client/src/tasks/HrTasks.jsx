import { React, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import FileList from "../components/manager/FileList";
import LinkList from "../components/LinkList";

import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  IconButton,
} from "@material-tailwind/react";
import { Fade } from "react-awesome-reveal";
import {
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";

export const Checkbox = ({ isChecked, label, checkHandler, index }) => {
  return (
    <div>
      <input
        type="checkbox"
        id={`checkbox-${index}`}
        checked={isChecked}
        onChange={checkHandler}
      />
    </div>
  );
};

function HrTasks() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState(0);
  const [taskCategory, setTaskCategory] = useState("HR-Tasks");
  const navigate = useNavigate();

  const userStateLocalStorage = localStorage.getItem("FirestoreUser");
  const firestoreUser = JSON.parse(userStateLocalStorage);
  const token = localStorage.getItem("token");

  const handleOpen = (value) => setOpen(open === value ? 0 : value);

  const updateCheckStatus = async (index) => {
    const updatedData = tasks.map((task, currentIndex) =>
      currentIndex === index ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedData);

    const task = tasks[index];
    task.completed = !task.completed;

    await axios.put(
      `https://localhost:7170/task/${firestoreUser.email}`,
      task,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
        },
      }
    );

    firestoreUser.activities = updatedData;
    const completedTasks = updatedData.filter(
      (task) => task.completed === true
    );

    if (completedTasks.length == updatedData.length) {
      await fetch("https://localhost:7170/email/complete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(firestoreUser),
      });

      if (taskCategory == "HR-Tasks") {
        navigate("/home");
      } else {
        setTaskCategory("Team-Tasks");
      }
    }
  };

  useEffect(() => {
    fetch(
      `https://localhost:7170/task/${firestoreUser.firestoreId}/${taskCategory}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // Include the access token in the Authorization header
          "Content-Type": "application/json",
        },
      }
    )
      .then((response) => response.json())
      .then((tasks) => setTasks(tasks))
      .catch((error) => console.error("Error fetching data:", error));
  }, [taskCategory]);

  return (
    <div className="flex flex-col px-20 md:px-20 md:flex-row items-center justify-around">
      <div className="w-full">
        <div className="px-9 pb-4  rounded-b-lg">
          <h1 className="text-center text-2xl font-bold">
            Practical set up to get you started
          </h1>
          <div className="flex justify-between pt-8">
            <div className="w-full max-w-2xl mx-auto">
              <Fade triggerOnce cascade damping={0.1}>
                <ol>
                  {tasks.map((task, index) => (
                    <li
                      key={task.name}
                      className="flex w-full mb-3 tracking-normal"
                    >
                      <ListItem className="p-0 w-10">
                        <label
                          htmlFor={`checkbox-${index}`}
                          className="flex w-full cursor-pointer items-center px-3 py-2"
                        >
                          <ListItemPrefix className="">
                            <Checkbox
                              key={task.name}
                              isChecked={task.completed}
                                          checkHandler={() => updateCheckStatus(index)}
                              label={task.name}
                              index={index}
                              className="h-"
                            />
                          </ListItemPrefix>
                        </label>
                      </ListItem>
                      <Accordion open={open === index}>
                        <AccordionHeader onClick={() => handleOpen(index)}>
                          <Typography
                            color="blue-gray"
                            className="font-medium "
                          >
                            <span className="ubuntu-medium text-xl">
                              {task.name}
                            </span>
                            {/* index: {task.priorityIndex} */}
                          </Typography>
                        </AccordionHeader>
                        <AccordionBody>
                          <span className="text-lg">
                            {task.description
                              ? task.description
                              : "Description missing"}
                          </span>
                        </AccordionBody>
                      </Accordion>
                    </li>
                  ))}

                  <div>
                    <h1 className="pb-3 text-xl mt-5">Downloadable content</h1>
                    <FileList folder="HR-Documents" />
                  </div>
                  <div>
                    <h1 className="pb-3 text-xl mt-5">Clickable links</h1>
                     <LinkList teamId={""} department={"hr"} />
                  </div>
                </ol>
              </Fade>
            </div>
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
}

export default HrTasks;
