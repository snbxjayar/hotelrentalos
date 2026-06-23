import { useEffect, useState } from "react";
import {
  Box, Card, CardContent, Typography, Chip,
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Skeleton,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import HotelIcon from "@mui/icons-material/Hotel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Layout from "../components/Layout";
import { getRooms, getTodayCheckIns, getTodayCheckOuts, getRecentBookings } from "../services/firebase";
import type { Room, Booking } from "../types/auth";

const statusColor: Record<string, "success" | "error" | "warning" | "info" | "default"> = {
    available: "success",
    occupied: "error",
    maintenance: "warning",
    reserved: "info",
    confirmed: "info",
    "checked-in": "success",
    "checked-out": "default",
    cancelled: "error",
};

const roomStatusBg: Record<string, string> = {
    available: "linear-gradient(135deg, #dcfce7, #bbf7d0)",
    occupied: "linear-gradient(135deg, #fee2e2, #fecaca)",
    maintenance: "linear-gradient(135deg, #fef3c7, #fde68a)",
    reserved: "linear-gradient(135deg, #dbeafe, #bfdbfe)",
};

const roomStatusBorder: Record<string, string> = {
    available: "#16a34a",
    occupied: "#dc2626",
    maintenance: "#d97706",
    reserved: "#2563eb",
};

export default function Dashboard() {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [checkIns, setCheckIns] = useState<Booking[]>([]);
    const [checkOuts, setCheckOuts] = useState<Booking[]>([]);
    const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadData() {
            try {
                const [r, ci, co, rb] = await Promise.all([
                    getRooms(), getTodayCheckIns(), getTodayCheckOuts(), getRecentBookings(),
                ]);
                setRooms(r); setCheckIns(ci); setCheckOuts(co); setRecentBookings(rb);
            } catch (err) {
                console.error("Error loading dashboard data:", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const available = rooms.filter((r) => r.status === "available").length;
    const occupied = rooms.filter((r) => r.status === "occupied").length;
    //const _maintenance = rooms.filter((r) => r.status === "maintenance").length;
    //const _reserved = rooms.filter((r) => r.status === "reserved").length;
    const totalRevenue = recentBookings.reduce((sum, b) => sum + b.totalAmount, 0);

    const stats = [
        { label: "Total Rooms", value: rooms.length, icon: <HotelIcon />, gradient: "linear-gradient(135deg, #0f2d5e, #1a4080)", light: "#dbeafe" },
        { label: "Available", value: available, icon: <CheckCircleIcon />, gradient: "linear-gradient(135deg, #16a34a, #15803d)", light: "#dcfce7" },
        { label: "Today's Check-ins", value: checkIns.length, icon: <LoginIcon />, gradient: "linear-gradient(135deg, #ff6b4a, #cc4e32)", light: "#ffedd5" },
        { label: "Today's Check-outs", value: checkOuts.length, icon: <LogoutIcon />, gradient: "linear-gradient(135deg, #7c3aed, #6d28d9)", light: "#ede9fe" },
        { label: "Occupied", value: occupied, icon: <HotelIcon />, gradient: "linear-gradient(135deg, #dc2626, #b91c1c)", light: "#fee2e2" },
        { label: "Recent Revenue", value: `₱${totalRevenue.toLocaleString()}`, icon: <AttachMoneyIcon />, gradient: "linear-gradient(135deg, #059669, #047857)", light: "#d1fae5" },
    ];

    return (
        <Layout>
            <Box sx={{ p: 4 }}>

                {/* Header */}
                <Box sx={{
                    mb: 4,
                    p: 3,
                    borderRadius: "16px",
                    background: "linear-gradient(135deg, #0f2d5e 0%, #1a4080 50%, #ff6b4a 150%)",
                    color: "#ffffff",
                }}>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: "#ffffff" }}>
                        Dashboard
                    </Typography>
                    <Typography sx={{ color: "rgba(255,255,255,0.75)", mt: 0.5 }}>
                        {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
                    </Typography>
                </Box>

                {/* Stat cards */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {stats.map((stat) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4, lg: 2 }} key={stat.label}>
                            <Card sx={{ borderRadius: "16px", overflow: "visible", position: "relative" }}>
                                <CardContent sx={{ p: 2.5 }}>
                                    <Box sx={{
                                        width: 44, height: 44, borderRadius: "12px",
                                        background: stat.gradient,
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        color: "#ffffff", mb: 2,
                                        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                    }}>
                                        {stat.icon}
                                    </Box>
                                    {loading ? (
                                        <Skeleton variant="text" width={60} height={40} />
                                    ) : (
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: "#111827", lineHeight: 1 }}>
                                            {stat.value}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" sx={{ color: "#6b7280", mt: 0.5, display: "block" }}>
                                        {stat.label}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Check-ins and Check-outs */}
                <Grid container spacing={2.5} sx={{ mb: 4 }}>
                    {[
                        { title: "Today's Check-ins", emoji: "✅", data: checkIns },
                        { title: "Today's Check-outs", emoji: "🚪", data: checkOuts },
                    ].map(({ title, emoji, data }) => (
                        <Grid size={{ xs: 12, md: 6 }} key={title}>
                            <Card sx={{ height: "100%" }}>
                                <CardContent sx={{ p: 3 }}>
                                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, color: "#0f2d5e" }}>
                                        {emoji} {title}
                                        <Chip label={data.length} size="small" sx={{ ml: 1, backgroundColor: "#ff6b4a", color: "#ffffff", fontWeight: 700 }} />
                                    </Typography>
                                    {loading ? (
                                        [...Array(3)].map((_, i) => <Skeleton key={i} variant="text" height={48} sx={{ mb: 1 }} />)
                                    ) : data.length === 0 ? (
                                        <Typography variant="body2" sx={{ color: "#9ca3af", py: 2 }}>No entries today</Typography>
                                    ) : (
                                        data.map((b) => (
                                            <Box key={b.id} sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 1.5, borderBottom: "1px solid #f3f4f6" }}>
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: "#111827" }}>{b.guestName}</Typography>
                                                    <Typography variant="caption" sx={{ color: "#6b7280" }}>Room {b.roomNumber} · {b.roomType}</Typography>
                                                </Box>
                                                <Chip label={b.status} color={statusColor[b.status]} size="small" />
                                            </Box>
                                        ))
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>

                {/* Recent Bookings */}
                <Card sx={{ mb: 4 }}>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 2.5, fontWeight: 700, color: "#0f2d5e" }}>
                            📋 Recent Bookings
                        </Typography>
                        {loading ? (
                            <Skeleton variant="rectangular" height={200} sx={{ borderRadius: "8px" }} />
                        ) : recentBookings.length === 0 ? (
                            <Typography variant="body2" sx={{ color: "#9ca3af" }}>No bookings yet</Typography>
                        ) : (
                            <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "12px", border: "1px solid #f3f4f6" }}>
                                <Table>
                                    <TableHead>
                                        <TableRow sx={{ backgroundColor: "#f8fafc" }}>
                                            {["Guest", "Room", "Type", "Check-in", "Check-out", "Amount", "Status"].map((h) => (
                                                <TableCell key={h} sx={{ fontWeight: 600, color: "#6b7280", fontSize: 13, borderBottom: "2px solid #f3f4f6" }}>{h}</TableCell>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {recentBookings.map((b) => (
                                            <TableRow key={b.id} sx={{ "&:hover": { backgroundColor: "#f8fafc" } }}>
                                                <TableCell sx={{ fontWeight: 600, color: "#111827" }}>{b.guestName}</TableCell>
                                                <TableCell sx={{ color: "#374151" }}>Room {b.roomNumber}</TableCell>
                                                <TableCell><Chip label={b.roomType} size="small" variant="outlined" sx={{ borderRadius: "6px", fontSize: 11 }} /></TableCell>
                                                <TableCell sx={{ color: "#374151" }}>{b.checkIn}</TableCell>
                                                <TableCell sx={{ color: "#374151" }}>{b.checkOut}</TableCell>
                                                <TableCell sx={{ fontWeight: 600, color: "#059669" }}>₱{b.totalAmount.toLocaleString()}</TableCell>
                                                <TableCell><Chip label={b.status} color={statusColor[b.status]} size="small" /></TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Card>

                {/* Room Grid */}
                <Card>
                    <CardContent sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ mb: 1, fontWeight: 700, color: "#0f2d5e" }}>
                            🛏️ Room Availability
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
                            {[
                                { label: "Available", color: "#16a34a", bg: "#dcfce7" },
                                { label: "Occupied", color: "#dc2626", bg: "#fee2e2" },
                                { label: "Reserved", color: "#2563eb", bg: "#dbeafe" },
                                { label: "Maintenance", color: "#d97706", bg: "#fef3c7" },
                            ].map((l) => (
                                <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                    <Box sx={{ width: 12, height: 12, borderRadius: "3px", backgroundColor: l.bg, border: `1.5px solid ${l.color}` }} />
                                    <Typography variant="caption" sx={{ color: "#374151", fontWeight: 500 }}>{l.label}</Typography>
                                </Box>
                            ))}
                        </Box>
                        {loading ? (
                            <Skeleton variant="rectangular" height={150} sx={{ borderRadius: "8px" }} />
                        ) : rooms.length === 0 ? (
                            <Typography variant="body2" sx={{ color: "#9ca3af" }}>No rooms added yet. Add rooms in Firestore to see them here.</Typography>
                        ) : (
                            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(72px, 1fr))", gap: 1.5 }}>
                                {rooms.map((room) => (
                                    <Box key={room.id} sx={{
                                        background: roomStatusBg[room.status] || "#f3f4f6",
                                        border: `1.5px solid ${roomStatusBorder[room.status] || "#d1d5db"}`,
                                        borderRadius: "10px",
                                        p: 1.5,
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "transform 0.15s ease, box-shadow 0.15s ease",
                                        "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
                                    }}>
                                        <Typography variant="body2" sx={{ fontWeight: 700, color: roomStatusBorder[room.status] }}>{room.number}</Typography>
                                        <Typography variant="caption" sx={{ color: "#6b7280", fontSize: 10 }}>{room.type === "short-term" ? "ST" : "LT"}</Typography>
                                    </Box>
                                ))}
                            </Box>
                        )}
                    </CardContent>
                </Card>
            </Box>
        </Layout>
    );
}