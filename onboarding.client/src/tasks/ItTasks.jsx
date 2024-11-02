import { React, useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, useNavigate } from "react-router-dom";
import FileList from "../components/manager/FileList";

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

import ConfettiExplosion from "react-confetti-explosion";
import LinkList from "../components/LinkList";

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

function ItTasks() {
  const [tasks, setTasks] = useState([]);
  const [open, setOpen] = useState({});
  const navigate = useNavigate();

  const userStateLocalStorage = localStorage.getItem("FirestoreUser");
  const firestoreUser = JSON.parse(userStateLocalStorage);
  const token = localStorage.getItem("token");

  const handleOpen = (category, index) => {
    setOpen((prevOpen) => ({
      ...prevOpen,
      [category]: prevOpen[category] === index ? null : index,
    }));
  };

  const [isExploding, setIsExploding] = useState(false);
  const bigExplodeProps = {
    force: 0.6,
    duration: 5000,
    particleCount: 200,
    floorHeight: 1600,
    floorWidth: 1600,
  };

  const updateCheckStatus = async (id) => {
    const updatedData = tasks.map((task) =>
      task.firestoreId === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedData);

    const task = tasks.find((t) => t.firestoreId === id);
    task.completed = !task.completed;

    await axios.put(
      `https://localhost:7170/task/${firestoreUser.email}`,
      task,
      {
        headers: {
          Authorization: `Bearer ${token}`,
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
    }
  };

  useEffect(() => {
    fetch(`https://localhost:7170/task/${firestoreUser.firestoreId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((tasks) => setTasks(tasks))
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  return (
    <div className="flex flex-col px-20 md:px-20 md:flex-row items-center justify-around">
      <div className="w-full">
        <div className="px-9 pb-4  rounded-b-lg">
          <h1 className="text-center text-2xl font-bold">
            Practical set up to get you started
          </h1>
          <div className="flex justify-between pt-8">
            <div className="w-full max-w-4xl mx-auto">
              <Fade triggerOnce cascade damping={0.1}>
                <ol>
                  <h2 className="pb-3 text-xl mt-5">IT-Tasks</h2>
                  {tasks
                    ?.filter((task) => task.category === "IT-Tasks")
                    .map((task, index) => (
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
                                checkHandler={() =>
                                  updateCheckStatus(task.firestoreId)
                                }
                                label={task.name}
                                index={`IT-${index}`}
                                className="h-"
                              />
                            </ListItemPrefix>
                          </label>
                        </ListItem>
                        <Accordion open={open["IT-Tasks"] === index}>
                          <AccordionHeader
                            onClick={() => handleOpen("IT-Tasks", index)}
                          >
                            <Typography
                              color="blue-gray"
                              className="font-medium "
                            >
                              <span className="ubuntu-medium text-xl">
                                {task.name}
                              </span>
                            </Typography>
                          </AccordionHeader>
                          <AccordionBody>
                            <span className="ubuntu-regular text-lg">
                              {task.description || "Description missing"}
                            </span>
                          </AccordionBody>
                        </Accordion>
                      </li>
                    ))}

                  <h2 className="pb-3 text-xl mt-5">Team Tasks</h2>
                  {tasks
                    ?.filter((task) => task.category === "Team-Tasks")
                    .map((task, index) => (
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
                                checkHandler={() =>
                                  updateCheckStatus(task.firestoreId)
                                }
                                label={task.name}
                                index={`TEAM-${index}`}
                                className="h-"
                              />
                            </ListItemPrefix>
                          </label>
                        </ListItem>
                        <Accordion open={open["Team-Tasks"] === index}>
                          <AccordionHeader
                            onClick={() => handleOpen("Team-Tasks", index)}
                          >
                            <Typography
                              color="blue-gray"
                              className="font-medium "
                            >
                              <span className="ubuntu-medium text-xl">
                                {task.name}
                              </span>
                            </Typography>
                          </AccordionHeader>
                          <AccordionBody>
                            <span className="ubuntu-regular text-lg">
                              {task.description || "Description missing"}
                            </span>
                          </AccordionBody>
                        </Accordion>
                      </li>
                    ))}

                  <h2 className="pb-3 text-xl mt-5">Personal Tasks</h2>
                  {tasks
                    ?.filter((task) => task.category === "Personal-Tasks")
                    .map((task, index) => (
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
                                checkHandler={() =>
                                  updateCheckStatus(task.firestoreId)
                                }
                                label={task.name}
                                index={`PERSONAL-${index}`}
                                className="h-"
                              />
                            </ListItemPrefix>
                          </label>
                        </ListItem>
                        <Accordion open={open["Personal-Tasks"] === index}>
                          <AccordionHeader
                            onClick={() => handleOpen("Personal-Tasks", index)}
                          >
                            <Typography
                              color="blue-gray"
                              className="font-medium "
                            >
                              <span className="ubuntu-medium text-xl">
                                {task.name}
                              </span>
                            </Typography>
                          </AccordionHeader>
                          <AccordionBody>
                            <span className="ubuntu-regular text-lg">
                              {task.description || "Description missing"}
                            </span>
                          </AccordionBody>
                        </Accordion>
                      </li>
                    ))}

                  <div>
                    <h1 className="pb-3 text-xl mt-5">Downloadable content</h1>
                    <FileList folder={firestoreUser.teamId} />
                  </div>
                  <div>
                    <h1 className="pb-3 text-xl mt-5">Clickable links</h1>
                     <LinkList teamId={`/${firestoreUser.teamId}`} department={"team"}/>
                  </div>
                </ol>
              </Fade>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItTasks;
