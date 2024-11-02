import React, { useState, useEffect } from "react";
import {
  Checkbox,
  Card,
  List,
  ListItem,
  ListItemPrefix,
  Typography,
} from "@material-tailwind/react";
import { Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { useLocalStorage } from "@uidotdev/usehooks";
import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google";

export default function LogOutButton() {
  const [profile, setProfile] = useState();
  const [token] = useLocalStorage("token", "");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      axios
        .get(
          `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${token}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              Accept: "application/json",
            },
          }
        )
        .then((res) => {
          console.log(user);
          setProfile(res.data);
          localStorage.setItem("Userstate", JSON.stringify(res.data));
        })

        .catch((err) => console.log(err));
    }
  }, [token]);
  const logOut = () => {
    googleLogout();
    setProfile(null);
    navigate("/");
  };

  return (
    <button className="pl-2" onClick={logOut}>
      Log out
    </button>
  );
}
