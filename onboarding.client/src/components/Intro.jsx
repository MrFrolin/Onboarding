import React, { useState, useEffect } from "react";
import { Fade } from "react-awesome-reveal";

export default function Intro(login, profile) {
    const [videoId, setVideo] = useState("j9ArrnDVY8w");

    const token = localStorage.getItem("token");

    const userStateLocalStorage = localStorage.getItem("FirestoreUser");
    const obj = JSON.parse(userStateLocalStorage);

    useEffect(() => {
        fetch(`https://localhost:7170/team/video/${obj.teamId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error fetching video: ${response.statusText}`);
                }
                return response.text();
            })
            .then(data => {
                setVideo(data);
            })
            .catch(error => {
                console.error("Error fetching video data:", error);
            });
    }, []);

    return (
        <div>
            <div className="bg-white py-24 sm:py-24 text-center	w-9/12	mx-auto">
                <div className="mx-auto gap-y-20 px-6 lg:px-8">
                    <div className="">
                        <Fade triggerOnce>
                            {" "}
                            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                                Welcome to Visma - Let's get you started!
                            </h2>
                            <p className="mt-6 text-lg leading-8 text-gray-600 pb-5 max-w-screen-lg mx-auto">
                                We develop and deliver software to small businesses, medium
                                businesses, and the public sector – improving the work-life of
                                millions of people around the world. Our software simplifies and
                                automates complex and manual work processes, empowering people’s
                                everyday lives. <br />
                                <br /> Visma is a collection of entrepreneurial companies, each
                                with their own start-up mentality, personality, and leadership.
                                All our companies have business autonomy and go-to-market
                                freedom – a key ingredient to our growth.
                            </p>
                            <div className="aspect-video pt-5 max-w-screen-lg mx-auto">
                                <iframe
                                    className="w-full aspect-video"
                                    src={"https://www.youtube.com/embed/" + videoId}
                                    frameBorder="0"
                                    height="600"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </div>
                        </Fade>
                    </div>
                </div>
            </div>
        </div>
    );
}
