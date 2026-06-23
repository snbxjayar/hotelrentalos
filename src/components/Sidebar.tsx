import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import HotelIcon from "@mui/icons-material/Hotel";
import PeopleIcon from "@mui/icons-material/People";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import MenuIcon from "@mui/icons-material/Menu";
import { useAuth } from "../hooks/useAuth";

const SIDEBAR_WIDTH = 240;
const SIDEBAR_COLLAPSED = 72;

const navItems = [
  { label: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
  { label: "Bookings", icon: <BookOnlineIcon />, path: "/bookings" },
  { label: "Rooms", icon: <HotelIcon />, path: "/rooms" },
  { label: "Guests", icon: <PeopleIcon />, path: "/guests" },
  { label: "Reports", icon: <BarChartIcon />, path: "/reports" },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const width = collapsed ? SIDEBAR_COLLAPSED : SIDEBAR_WIDTH;

  return (
    <Drawer
      variant="permanent"
      sx={{
        width,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width,
          boxSizing: "border-box",
          background: "linear-gradient(180deg, #0f2d5e 0%, #081d3f 100%)",
          color: "#ffffff",
          border: "none",
          overflowX: "hidden",
          transition: "width 0.3s ease",
        },
      }}
    >
      {/* Logo area */}
      <Box sx={{
        px: collapsed ? 1 : 3,
        py: 3,
        display: "flex",
        alignItems: "center",
        justifyContent: collapsed ? "center" : "space-between",
        minHeight: 72,
      }}>
        {!collapsed && (
          <Box>
            <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 800, lineHeight: 1.1 }}>
              🏨 HotelRental
            </Typography>
            <Typography variant="caption" sx={{ color: "#ff6b4a", fontWeight: 600, letterSpacing: 1 }}>
              OS
            </Typography>
          </Box>
        )}
        <IconButton onClick={() => setCollapsed(!collapsed)} sx={{ color: "#ffffff", ml: collapsed ? 0 : 1 }}>
          {collapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Box>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mx: 2 }} />

      {/* Nav items */}
      <List sx={{ px: 1, mt: 1, flex: 1 }}>
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <ListItem key={item.label} disablePadding sx={{ mb: 0.5 }}>
              <Tooltip title={collapsed ? item.label : ""} placement="right">
                <ListItemButton
                  onClick={() => navigate(item.path)}
                  sx={{
                    borderRadius: "10px",
                    px: collapsed ? 1.5 : 2,
                    py: 1.2,
                    justifyContent: collapsed ? "center" : "flex-start",
                    backgroundColor: isActive ? "rgba(255,107,74,0.2)" : "transparent",
                    borderLeft: isActive ? "3px solid #ff6b4a" : "3px solid transparent",
                    "&:hover": {
                      backgroundColor: "rgba(255,255,255,0.08)",
                    },
                  }}
                >
                  <ListItemIcon sx={{
                    color: isActive ? "#ff6b4a" : "rgba(255,255,255,0.6)",
                    minWidth: collapsed ? 0 : 40,
                    justifyContent: "center",
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {!collapsed && (
                    <ListItemText
  primary={item.label}
  slotProps={{
    primary: {
        sx: {
            fontSize: 14,
      fontWeight: isActive ? 600 : 400,
        },
      color: isActive ? "#ffffff" : "rgba(255,255,255,0.7)",
    }
  }}
/>
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.1)", mx: 2 }} />

      {/* User profile at bottom */}
      <Box sx={{
        px: collapsed ? 1 : 2,
        py: 2,
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        justifyContent: collapsed ? "center" : "flex-start",
      }}>
        <Avatar sx={{ width: 36, height: 36, backgroundColor: "#ff6b4a", fontSize: 14, fontWeight: 700 }}>
          {user?.email?.charAt(0).toUpperCase()}
        </Avatar>
        {!collapsed && (
          <Box sx={{ flex: 1, overflow: "hidden" }}>
            <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.5)", display: "block" }}>
              Signed in as
            </Typography>
            <Typography variant="caption" sx={{ color: "#ffffff", fontWeight: 600, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {user?.email}
            </Typography>
          </Box>
        )}
        {!collapsed && (
          <Tooltip title="Sign out">
            <IconButton onClick={logout} sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#ff6b4a" } }}>
              <LogoutIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Drawer>
  );
}