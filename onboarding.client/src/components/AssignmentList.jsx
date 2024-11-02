import React, { useEffect, useState } from 'react';

function AssignmentList({ teamMembers }) {
    const [taskAssignments, setTaskAssignments] = useState([]);

    useEffect(() => {
        if (!teamMembers) return;

        const taskAssignments = {};

        teamMembers.forEach(user => {
            user.personalTaskNames.forEach(task => {
                if (!taskAssignments[task]) {
                    taskAssignments[task] = [];
                }
                if (!taskAssignments[task].includes(user.displayName)) {
                    taskAssignments[task].push(user.displayName);
                }
                if (!taskAssignments[task].includes(user.label)) {
                    taskAssignments[task].push(user.label);
                }
            });
        });

        const result = Object.keys(taskAssignments).map(task => ({
            taskName: task,
            assignedUsers: taskAssignments[task]
        }));

        setTaskAssignments(result);
    }, [teamMembers]);

    return (
        <div className="p-4">
            <p className="text-center text-gray-400 text-xs">
                Personal tasks overview
            </p>
            <hr />
            <ul className="list-none p-0">
                {taskAssignments.map((task, index) => (
                    <li key={index} className="flex justify-between items-center mb-2">
                        <strong className="text-lg">{task.taskName}</strong>
                        <ul className="flex w-1/6">
                            {task.assignedUsers.map((user, userIndex) => (
                                <li key={userIndex} className="text-gray-700 mr-2">{user}</li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default AssignmentList;
