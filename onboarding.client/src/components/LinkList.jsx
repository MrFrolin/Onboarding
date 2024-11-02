import { React, useState, useEffect } from "react";

export default function LinkList({ department, teamId }) {
    const [links, setLinks] = useState([]);

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetch(`https://localhost:7170/${department}/link${teamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then((response) => response.json())
            .then((links) => {
                setLinks(links);
            });
    }, []);

    const openLink = (link) => {
        if (link && typeof link === "string") {
            window.open(link, "_blank");
        } else {
            console.error("Invalid URL:", link);
        }
    };

    return (
        <div>
            <ul className="">
                {links?.map((link, i) => {
                    return (
                        <li
                            key={i}
                            onClick={() => openLink(link)}
                            className="text-blue-700 hover:bg-gray-100 hover:text-blue-700 px-2 py-2 rounded-lg cursor-pointer transition duration-300 text-lg font-medium"
                        >
                            {link}
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

