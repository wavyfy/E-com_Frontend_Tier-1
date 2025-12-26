"use client";

// import { useEffect } from "react";
// import { UserAPI } from "@/lib/api/user.api";
// import { useAuth } from "@/context/AuthContext";

export default function MePage() {
  // const { accessToken } = useAuth();

  // useEffect(() => {
  //   UserAPI.me(accessToken!)
  //     .then((data) => console.log("ME", data))
  //     .catch(() => {
  //       // no redirect here
  //       // layout handles auth
  //     });
  // }, [accessToken]);

  return <h1>Me (Protected)</h1>;
}
