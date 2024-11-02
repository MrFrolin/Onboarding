import React, { useState, useEffect } from "react";

import axios from "axios";

export default function googleAuth() {
  const [profile, setProfile] = useState(null);

  const token = localStorage.getItem("token");

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
          setProfile(res.data);
        })

        .catch((err) => console.log(err));
    }
  }, [token]);

  return profile;
}
