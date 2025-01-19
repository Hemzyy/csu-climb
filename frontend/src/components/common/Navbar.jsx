import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import DesktopNavbar from "./DesktopNavbar";
import MobileNavbar from "./MobileNavbar";

const Navbar = () => {
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) throw new Error("Logout failed");
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
  });

  const profileImg = authUser?.profileImg;

  return (
    <>
      <DesktopNavbar
        profileImg={profileImg}
        logout={logout}
        authUser={authUser}
      />
      <MobileNavbar
        profileImg={profileImg}
        logout={logout}
        authUser={authUser}
      />
    </>
  );
};

export default Navbar;