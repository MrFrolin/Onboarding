/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import googleAuth from "../hooks/googleAuth";
import { AnimatedBackground } from "animated-backgrounds";

const clientId = "REACT_APP_GOOGLE_AUTH_API";

// const background =
//     "https://images.pexels.com/photos/19119918/pexels-photo-19119918/free-photo-of-portrait-of-man-wearing-white-shirt-on-a-beach.jpeg";

const LoginComp = () => {
    const employee = googleAuth();
    const [token, saveToken] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState([]);
    const [profile, setProfile] = useState(null);
    const navigate = useNavigate();

    const login = useGoogleLogin({
        scope: "openid profile email",
        onSuccess: async (codeResponse, res) => {

            const userInfoUrl = `https://www.googleapis.com/oauth2/v3/userinfo?access_token=${codeResponse.access_token}`;
            const userInfoResponse = await fetch(userInfoUrl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });
            const userInfo = await userInfoResponse.json();

            if (userInfoResponse.status == 200) {
                const employeeVOM = await getEmployeeByEmail(userInfo.email, codeResponse.access_token);
                const userExist = await checkIfUserExist(userInfo.email, codeResponse.access_token);
                let user = null;

                if (userExist) {
                    user = await getUserByEmail(userInfo.email, codeResponse.access_token);
                }
                else {
                    user = await saveLoginUserToDatabase(employeeVOM, codeResponse.access_token);
                    //Send email to IT to get computer
                    await fetch("https://localhost:7170/email/newUser", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${codeResponse.access_token}`,
                        },
                        body: JSON.stringify(user),
                    });
                }
                console.log(user);
                if (user) {
                    console.log("The user exists!");
                } else {
                    alert("Not found in VOM. Please use firstname.lastname@visma.com");
                    e.preventDefault();
                }
                localStorage.setItem("FirestoreUser", JSON.stringify(user));
                localStorage.setItem("User", JSON.stringify(userInfo));
                localStorage.setItem("token", codeResponse.access_token);
            }
            saveToken(codeResponse.access_token);
            navigate("/home");
            
        },
        onError: (error) => console.log("Login Failed:", error),

    });
    async function saveLoginUserToDatabase(employeeVOM, token) {
        try {
            const response = await fetch("https://localhost:7170/firestoreuser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    Email: employeeVOM.email,
                    FirstName: employeeVOM.firstName,
                    LastName: employeeVOM.lastName,
                    OrganisationName: employeeVOM.organisationName,
                    ManagerName: employeeVOM.managerName,
                    ManagerEmail: employeeVOM.managerEmail,
                    MainDiscipline: employeeVOM.mainDiscipline,
                    PositionName: employeeVOM.positionName,
                    VismaId: employeeVOM.id,
                    TeamId: String(employeeVOM.teamId),
                    Tasks: [],
                }),
            });
            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async function checkIfUserExist(email, token) {
        try {
            const response = await fetch(
                `https://localhost:7170/firestoreuser/checkuser/${email}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async function getUserByEmail(email, token) {
        try {
            const response = await fetch(
                `https://localhost:7170/firestoreuser/${email}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            console.log(data);
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }

    async function getEmployeeByEmail(email, token) {
        try {
            const response = await fetch(`https://localhost:7170/employee/${email}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                throw new Error("Network response was not ok");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }
    return (
        <section>
            <>
                <AnimatedBackground animationName="floatingBubbles" />
                <div className="h-screen flex items-center justify-center container mx-auto ">
                    <div className="m-auto md:w-4/12 content-center">
                        <div className="rounded-xl bg-white dark:bg-gray-800 shadow-xl">
                            <div className="p-8">
                                <div className="space-y-4">
                                    <img
                                        src="https://www.vildika.com/wp-content/uploads/visma-logo-png-transparent-small.png"
                                        loading="lazy"
                                        className="w-36 text-center mx-auto"
                                    />
                                    <h2 className="mb-8 text-2xl text-cyan-900 dark:text-white font-bold text-center">
                                        Welcome to the Onboarding <br />
                                        For Visma Enterprise.
                                    </h2>
                                </div>
                                <div className="mt-10 grid space-y-4">
                                    <button
                                        className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100"
                                        onClick={profile ? logOut : login}
                                    >
                                        <div className="relative flex items-center space-x-4 justify-center">
                                            <img
                                                src="https://www.svgrepo.com/show/475656/google-color.svg"
                                                className="absolute left-0 w-5"
                                                alt="google logo"
                                            />
                                            <span className="block w-max font-semibold tracking-wide text-gray-700 dark:text-white text-sm transition duration-300 group-hover:text-blue-600 sm:text-base">
                                                {profile ? "Log out" : "Continue with Google"}
                                            </span>
                                        </div>
                                    </button>
                                    <button className="group h-12 px-6 border-2 border-gray-300 rounded-full transition duration-300 hover:border-blue-400 focus:bg-blue-50 active:bg-blue-100">
                                        <div className="relative flex items-center space-x-4 justify-center">
                                            <img
                                                src="https://www.vildika.com/wp-content/uploads/visma-logo-png-transparent-small.png"
                                                width="40"
                                                className="absolute left-0 w-12"
                                            />
                                            <span className="block w-max font-semibold tracking-wide text-gray-700 text-sm transition dark:text-white duration-300 group-hover:text-blue-600 sm:text-base">
                                                Login with Visma Connect
                                            </span>
                                        </div>
                                    </button>
                                </div>
                                <div className="mt-14 space-y-4 py-3 text-gray-600 dark:text-gray-400 text-center">
                                    <p className="text-xs">
                                        By proceeding, you agree to our
                                        <a href="/privacy-policy/" className="underline pl-1">
                                            Terms of Use
                                        </a>
                                        and confirm you have read our
                                        <a href="/privacy-policy/" className="underline pl-1">
                                            Privacy and Cookie Statement
                                        </a>
                                        .
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        </section>
    );
};
export default LoginComp;
