
import { React, useState, useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import axios from "axios";
import EditTaskList from "../manager/EditTaskList";
import PersonalTasksList from "../PersonalTasksList";
import AssignmentList from "../AssignmentList";
import { Fade } from "react-awesome-reveal";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function ManageHRTasks({ taskCategory }) {
    const [loading, setLoading] = useState(false);
    const [taskTitleValue, setTaskTitleValue] = useState("");
    const [taskDescriptionValue, setTaskDescriptionValue] = useState("");
    const [videoURL, setVideoURL] = useState("");
    const [newLink, setNewLink] = useState("");
    const [tasks, setTasks] = useState([]);
    const [addedTaskList, setAddedTaskList] = useState(
        JSON.parse(localStorage.getItem("addedTaskList")) || []
    );

    const ClickableLinknotify = () =>
        toast("Clickable link added.", {
            position: "bottom-right",
            className: "z-1000 mb-10",
        });
    const YoutubeLinknotify = () =>
        toast("Youtube link added.", {
            position: "bottom-right",
            className: "z-1000 mb-10",
        });
    const AddTaskToQueue = () =>
        toast("Task(s) added to queue.", {
            position: "bottom-right",
            className: "z-1000 mb-10",
        });
    const PublishTasks = () =>
        toast("Task(s) have been published", {
            position: "bottom-right",
            className: "z-1000 mb-10",
        });

    const userStateLocalStorage = localStorage.getItem("FirestoreUser");
    const firestoreUserObj = JSON.parse(userStateLocalStorage);
    const token = localStorage.getItem("token");

    const handleUpdateAddedTaskList = (updatedTaskList) => {
        setAddedTaskList(updatedTaskList);
        localStorage.setItem("addedTaskList", JSON.stringify(updatedTaskList));
    };

    const publishData = async () => {
        setLoading(true);
        const newTasks = addedTaskList.map((task) => ({
            ...task,
            priorityIndex: tasks.length + task.priorityIndex,
        }));

        await setTasksToTeamMembers(newTasks);

        localStorage.removeItem("addedTaskList");
        setAddedTaskList([]);
        setLoading(false);
    };

    const setTasksToTeamMembers = async (newTasks) => {
        const allTasks = [...tasks, ...newTasks];
        const sortedTasks = allTasks.sort(
            (a, b) => a.priorityIndex - b.priorityIndex
        );
        setTasks(sortedTasks);

        await axios.put(
            `https://localhost:7170/task/manager/${firestoreUserObj.teamId}`,
            allTasks,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        addTask(taskTitleValue, taskDescriptionValue);
    };

    const addTask = async (newTaskName, newDescription) => {
        const localTaskList =
            JSON.parse(localStorage.getItem("addedTaskList")) || [];
        const response = await axios.get(
            `https://localhost:7170/task/${firestoreUserObj.email}?taskName=${newTaskName}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        const listOfExistingNames = localTaskList.map((n) => n.name);
        if (
            listOfExistingNames.includes(newTaskName) ||
            response.data.name != null
        ) {
            console.log("Task already exist");
            return;
        }

        let priorityIndex = addedTaskList.length;
        let category = "HR-Tasks";

        const newTask = {
            name: newTaskName,
            completed: false,
            category: category,
            priorityIndex: priorityIndex + 1,
            description: newDescription,
        };
        const updatedTaskList = [...addedTaskList, newTask];
        handleUpdateAddedTaskList(updatedTaskList);
        setTaskTitleValue("");
        setTaskDescriptionValue("");
    };

    const deleteTask = async (id) => {
        const task = tasks.find((task) => task.firestoreId === id);

        const response = await axios.delete(
            `https://localhost:7170/task/manager/${firestoreUserObj.teamId}?taskName=${task.name}&category=${task.category}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        if (response.status === 200) {
            const deletedTaskPriorityIndex = task.priorityIndex;

            let updatedTasks = tasks.filter(
                (task) => task.priorityIndex !== deletedTaskPriorityIndex
            );

            //Change idices of tasks after the deleted task
            updatedTasks = updatedTasks.map((task) => {
                if (task.priorityIndex > deletedTaskPriorityIndex) {
                    return { ...task, priorityIndex: task.priorityIndex - 1 };
                }
                return task;
            });
            setTasks(updatedTasks);

            if (!updatedTasks.length === 0) {
                await axios.put(
                    `https://localhost:7170/task/manager/${firestoreUserObj.teamId}`,
                    updatedTasks,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
            }
        } else {
            console.error("Error deleting task");
        }
    };

    const moveUp = (index) => {
        if (tasks[index].priorityIndex === 1) {
            console.log("Cant change index lower then 1");
            return;
        }
        const newItems = [...tasks];
        newItems[index].priorityIndex -= 1;
        newItems[index - 1].priorityIndex += 1;
        newItems.sort((a, b) => a.priorityIndex - b.priorityIndex);
        setTasks(newItems);
    };

    const moveDown = (index) => {
        const maxPriorityIndex = Math.max(
            ...tasks.map((task) => task.priorityIndex)
        );

        if (tasks[index].priorityIndex >= maxPriorityIndex) {
            console.log("Cant change index 1 or last index");
            return;
        }
        const newItems = [...tasks];
        newItems[index].priorityIndex += 1;
        newItems[index + 1].priorityIndex -= 1;
        newItems.sort((a, b) => a.priorityIndex - b.priorityIndex);
        setTasks(newItems);
    };

    const UpdateVideoURL = async (e) => {
        e.preventDefault();
        await axios.put(
            `https://localhost:7170/hr/video/?videoUrl=${videoURL}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        setVideoURL("");
    };

    const UpdateLink = async (e) => {
        e.preventDefault();
        await axios.put(
            `https://localhost:7170/hr/link/?link=${newLink}`,
            {},
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        setNewLink("");
    };

    useEffect(() => {
        fetch(`https://localhost:7170/task/${firestoreUserObj.firestoreId}/${taskCategory}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        })
            .then((response) => response.json())
            .then((data) => {
                setTasks(data);
            })
            .catch((error) => console.error("Error fetching tasks:", error));
    }, []);

    return (
        <div className="max-w-5xl mx-auto mt-5">
            <div className="flex flex-col px-20 md:px-20 md:flex-row items-center justify-around">
                <div className="w-full">
                    <div className="px-9 pb-4  rounded-b-lg">
                        <h1 className="text-center text-xl font-bold">
                            Set up tasks for your new employee to do.
                        </h1>
                        <br />

                        <form className="max-w-xl mx-auto mt-5" onSubmit={handleSubmit}>
                            <div className="mb-5">
                                <label
                                    htmlFor="email"
                                    className="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Task title
                                </label>
                                <input
                                    value={taskTitleValue}
                                    onChange={(e) => setTaskTitleValue(e.target.value)}
                                    type="text"
                                    id="email"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required
                                />

                                <label
                                    htmlFor="email"
                                    className="pt-5 block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >
                                    Task description
                                </label>
                                <textarea
                                    id="message"
                                    rows="2"
                                    value={taskDescriptionValue}
                                    onChange={(e) => setTaskDescriptionValue(e.target.value)}
                                    className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    placeholder="Write your thoughts here..."
                                ></textarea>

                                <button
                                    onClick={AddTaskToQueue}
                                    disabled={!taskTitleValue}
                                    type="submit"
                                    className="mx-auto text-center block mt-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                        {loading ? (
                            <div className="flex m-12 justify-center items-center">
                                <TailSpin color="blue" radius={"8px"} />
                            </div>
                        ) : (
                            <>
                                <EditTaskList
                                    initialTasks={addedTaskList}
                                    onTaskListUpdate={handleUpdateAddedTaskList}
                                />
                                <form className="max-w-xl mx-auto mt-5" onSubmit={handleSubmit}>
                                    <button
                                        type="submit"
                                        className="mt-5 mb-5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 text-center mx-0 mx-auto block text-white"
                                        onClick={() => {
                                            publishData();
                                            PublishTasks();
                                        }}
                                    >
                                        Click here to publish your tasks.
                                    </button>
                                </form>
                                <div className="flex justify-between pt-8">
                                    <div className="w-full max-w-2xl mx-auto">
                                        <ul>
                                            <Fade triggerOnce cascade damping={0.1}>
                                                <p className="text-center text-gray-400 text-xs">
                                                    HR tasks
                                                </p>
                                                <hr />

                                                {tasks.map((task, index) => (
                                                    <li key={task.name} className="flex w-full">
                                                        <label
                                                            htmlFor={`checkbox-${index}`}
                                                            className="flex w-full cursor-pointer items-center py-2"
                                                        >
                                                            <span>
                                                                <p className="text-xl font-medium">
                                                                    {task.name}
                                                                </p>
                                                                <p className="text-center text-gray-600 text-md pt-2">
                                                                    {task.description}
                                                                </p>
                                                            </span>
                                                        </label>

                                                        <>
                                                            <div className="flex w-1/6">
                                                                {!task.basicTask ? (
                                                                    <>
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
                                                                            onClick={() =>
                                                                                deleteTask(task.firestoreId)
                                                                            }
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
                                                                    </>
                                                                ) : (
                                                                    ""
                                                                )}
                                                            </div>
                                                        </>
                                                    </li>
                                                ))}
                                            </Fade>
                                        </ul>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <form className="max-w-xl mx-auto mt-5" onSubmit={UpdateVideoURL}>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Youtube URL
                </label>
                <div className="mb-5 flex">
                    <input
                        value={videoURL}
                        onChange={(e) => setVideoURL(e.target.value)}
                        type="text"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={!videoURL}
                        onClick={YoutubeLinknotify}
                        className="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >
                        Add
                    </button>
                </div>
            </form>
            <form className="max-w-xl mx-auto mt-5" onSubmit={UpdateLink}>
                <label
                    htmlFor="email"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Add clickable link
                </label>
                <div className="mb-5 flex">
                    <input
                        value={newLink}
                        onChange={(e) => setNewLink(e.target.value)}
                        type="text"
                        id="email"
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                        required
                    />
                    <button
                        type="submit"
                        disabled={!newLink}
                        onClick={ClickableLinknotify}
                        className="ml-3 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    >

                        Add
                    </button>
                    <ToastContainer
                        autoClose={5000}
                        hideProgressBar={false}
                        newestOnTop={false}
                        closeOnClick
                        rtl={false}
                        pauseOnFocusLoss
                        draggable
                        pauseOnHover
                        theme="light"
                        transition: Bounce
                    />
                </div>
            </form>
        </div>
    );
}

export default ManageHRTasks;
