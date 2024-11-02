import React, { useState, useEffect } from "react";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { googleLogout, useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import Login from "../components/LoginComp";
import LoginComp from "../components/LoginComp";

export default function LoginPage() {
  const logOut = () => {
    googleLogout();
    // setProfile(null);
  };

  return (
    <div>
      <LoginComp />
    </div>
  );
}
