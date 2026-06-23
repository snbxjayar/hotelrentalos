import { Box } from "@mui/material";
import Sidebar from "./Sidebar";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#f0f4f8" }}>
      <Sidebar />
      <Box component="main" sx={{ flex: 1, overflow: "auto" }}>
        {children}
      </Box>
    </Box>
  );
}