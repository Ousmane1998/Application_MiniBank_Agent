import React, { useState, useEffect } from "react";
import {
  IconButton,
  Menu,
  MenuItem,
  Box,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const ProfileMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [userPhoto, setUserPhoto] = useState("");
  const open = Boolean(anchorEl);
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    
    if (storedUser) {
      const user = JSON.parse(storedUser);
      const baseURL = "https://application-minibank-agent.onrender.com/images/";
      setUserPhoto(
  user.photo?.startsWith("http")
    ? user.photo
    : `${baseURL}${user.photo || "default.jpg"}`
);
    }
  }, []);

  const handleOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => setAnchorEl(null);

  const handleProfile = () => {
    handleClose();
    navigate("/profil");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <Box>
      <IconButton onClick={handleOpen} color="inherit">
        <Avatar src={userPhoto} alt="Profil" />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleProfile}>Profil</MenuItem>
        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
      </Menu>
    </Box>
  );
};

export default ProfileMenu;
