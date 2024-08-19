import React from "react";
import { useAppStore } from "@/store";

function Profile() {
  const { userInfo } = useAppStore();

  return (
    <div>
      Profile
      <div>Email: {userInfo.id}</div>
      <div>Email: {userInfo.email}</div>
    </div>
  );
}

export default Profile;
