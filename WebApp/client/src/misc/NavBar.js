import { AppBar, Typography } from "@material-ui/core";
import React from "react";

export default function NavBar() {
  return (
    <AppBar
      style={{
        position: "fixed",
        top: "0",
        width: "100%",
        minHeight: "50px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <Typography style={{ marginLeft: "30px" }}>
        Welcome to Amazon Reviews app
      </Typography>
    </AppBar>
  );
}
