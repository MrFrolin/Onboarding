/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { React, useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";

import {
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
  IconButton,
} from "@material-tailwind/react";

function EditTaskList({ initialTasks, onTaskListUpdate }) {
  const [addedTaskList, setAddedTaskList] = useState(initialTasks);

  const updateTaskList = (newTaskList) => {
    setAddedTaskList(newTaskList);
    onTaskListUpdate(newTaskList);
  };

  useEffect(() => {
    setAddedTaskList(initialTasks);
  }, [initialTasks]);

  const moveUp = (index) => {
    if (addedTaskList[index].priorityIndex === 1) {
      console.log("Cant change index lower then 1");
      return;
    }
    const newItems = [...addedTaskList];
    newItems[index].priorityIndex -= 1;
    newItems[index - 1].priorityIndex += 1;
    newItems.sort((a, b) => a.priorityIndex - b.priorityIndex);
    updateTaskList(newItems);
  };

  const moveDown = (index) => {
    const maxPriorityIndex = Math.max(
      ...addedTaskList.map((task) => task.priorityIndex)
    );

    if (addedTaskList[index].priorityIndex >= maxPriorityIndex) {
      console.log("Cant change index 1 or last index");
      return;
    }
    const newItems = [...addedTaskList];
    newItems[index].priorityIndex += 1;
    newItems[index + 1].priorityIndex -= 1;
    newItems.sort((a, b) => a.priorityIndex - b.priorityIndex);
    updateTaskList(newItems);
  };

  const deleteTask = async (priorityIndex) => {
    const task = addedTaskList.find(
      (task) => task.priorityIndex === priorityIndex
    );
    const deletedTaskPriorityIndex = task.priorityIndex;
    let updatedTasks = addedTaskList.filter(
      (task) => task.priorityIndex !== deletedTaskPriorityIndex
    );
    //Change idices of tasks after the deleted task
    updatedTasks = updatedTasks.map((task) => {
      if (task.priorityIndex > priorityIndex) {
        return { ...task, priorityIndex: task.priorityIndex - 1 };
      }
      return task;
    });
    updateTaskList(updatedTasks);
  };

  return (
    <div className="flex justify-between pt-8">
      <div className="w-full max-w-2xl mx-auto">
        <ul>
          <Fade triggerOnce duration="500">
            {addedTaskList.map((task, index) => (
              <li key={index} className="flex w-full">
                <ListItem className="p-0 w-5/6">
                  <label className="flex w-full cursor-pointer items-center px-3 py-2">
                    <Typography color="blue-gray" className="font-medium">
                      <b className="text-lg">{task.name}</b>
                      <br />
                      <b className="text-center text-gray-400 text-md">
                        {task.description}
                      </b>
                    </Typography>
                  </label>
                </ListItem>
                <>
                  <div className="flex w-1/6">
                    <button onClick={() => moveUp(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m4.5 15.75 7.5-7.5 7.5 7.5"
                        />
                      </svg>
                    </button>
                    <button onClick={() => moveDown(index)}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="m19.5 8.25-7.5 7.5-7.5-7.5"
                        />
                      </svg>
                    </button>
                    <button
                      className="rounded-md border border-transparent text-center text-sm transition-all text-slate-600 hover:bg-slate-200 focus:bg-slate-200 active:bg-slate-200 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none w-1/6"
                      type="button"
                      onClick={() => deleteTask(task.priorityIndex)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.5 4.478v.227a48.816 48.816 0 0 1 3.878.512.75.75 0 1 1-.256 1.478l-.209-.035-1.005 13.07a3 3 0 0 1-2.991 2.77H8.084a3 3 0 0 1-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 0 1-.256-1.478A48.567 48.567 0 0 1 7.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 0 1 3.369 0c1.603.051 2.815 1.387 2.815 2.951Zm-6.136-1.452a51.196 51.196 0 0 1 3.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 0 0-6 0v-.113c0-.794.609-1.428 1.364-1.452Zm-.355 5.945a.75.75 0 1 0-1.5.058l.347 9a.75.75 0 1 0 1.499-.058l-.346-9Zm5.48.058a.75.75 0 1 0-1.498-.058l-.347 9a.75.75 0 0 0 1.5.058l.345-9Z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                </>
              </li>
            ))}
          </Fade>
        </ul>
      </div>
    </div>
  );
}

export default EditTaskList;
