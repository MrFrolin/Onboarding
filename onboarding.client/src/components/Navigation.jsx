import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import { useHookstate } from "@hookstate/core";
import { React, useState, useEffect } from "react";
import LogOutButton from "../hooks/logOut";
import { createBrowserRouter, RouterProvider, Link } from "react-router-dom";

const background2 =
  "https://assets-global.website-files.com/6305e59e1a8fa3e7f5f8e555/660e9f6e9aeb028f51928647_65faf224a40316c0003b62e0_annual_report%20header%20bg-p-1600%20copy.jpg";

const Navigation = () => {
  const userStateLocalStorage = localStorage.getItem("FirestoreUser");
  const parsedFsUser = JSON.parse(userStateLocalStorage);
  const stateLocalStorage = localStorage.getItem("User");
  const employee = JSON.parse(stateLocalStorage);

  return (
    <div>
      <div
        className="fixed d-block z-50 w-full"
        // style={{ backgroundColor: "#003253" }}
        style={{ backgroundColor: "#020617" }}
      >
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed bg-transparent"></div>

        <div className="w-full">
          <div className="relative z-1 h-16 mx-auto px-5 max-w-7xl flex items-center justify-between text-white">
            <a
              className="text-2xl hover:text-cyan-400 transition-colors"
              href=""
            >
              {" "}
              <img
                src="https://i.ibb.co/JRnT0qH/media-removebg-preview.png"
                width="200"
                alt=""
                srcSet=""
              />
            </a>

            <div className="flex items-center gap-5 ubuntu-regular">
              {!parsedFsUser.isManager ? (
                <>
                  <Link to="/home">Home</Link>
                  <Link to="/hr">HR</Link>
                </>
              ) : (
                <>
                  <Link to="/home">Home</Link>
                  <Link to="/manager">ManagerHub</Link>
                  <Link to="/hr">HR</Link>
                </>
              )}
              {!parsedFsUser.isHRManager ? (
                <>
                  <Link to="/hrhub">HrHub</Link>
                </>
              ) : (
                <>
                  <Link to="/hrhub">HrHub</Link>
                </>
              )}

              {employee ? (
                <div className="flex items-center">
                  <p className="pr-2 font-bold">{employee.name}</p>
                  <Link to="/profile">
                    <img
                      src={employee.picture}
                      alt="user image"
                      className="w-10 rounded-full"
                      referrerPolicy="no-referrer"
                    />
                  </Link>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
