import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { getRooms, getTodayCheckIns, getTodayCheckOuts, getRecentBookings } from "../services/firebase";
import type { Room, Booking } from "../types/auth";

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [checkIns, setCheckIns] = useState<Booking[]>([]);
  const [checkOuts, setCheckOuts] = useState<Booking[]>([]);
  const [recentBookings, setRecentBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [r, ci, co, rb] = await Promise.all([
          getRooms(),
          getTodayCheckIns(),
          getTodayCheckOuts(),
          getRecentBookings(),
        ]);
        setRooms(r);
        setCheckIns(ci);
        setCheckOuts(co);
        setRecentBookings(rb);
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
  const maintenance = rooms.filter((r) => r.status === "maintenance").length;
  const reserved = rooms.filter((r) => r.status === "reserved").length;
  const totalRevenue = recentBookings.reduce((sum, b) => sum + b.totalAmount, 0);

  const statusColor: Record<string, string> = {
    available: "#16a34a",
    occupied: "#dc2626",
    maintenance: "#d97706",
    reserved: "#2563eb",
    confirmed: "#2563eb",
    "checked-in": "#16a34a",
    "checked-out": "#6b7280",
    cancelled: "#dc2626",
  };

  const statusBg: Record<string, string> = {
    available: "#dcfce7",
    occupied: "#fee2e2",
    maintenance: "#fef3c7",
    reserved: "#dbeafe",
    confirmed: "#dbeafe",
    "checked-in": "#dcfce7",
    "checked-out": "#f3f4f6",
    cancelled: "#fee2e2",
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", color: "#6b7280" }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6" }}>

      {/* Navbar */}
      <div style={{ backgroundColor: "#ffffff", borderBottom: "1px solid #e5e7eb", padding: "16px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ fontSize: "20px", fontWeight: 700, color: "#111827" }}>🏨 HotelRentalOS</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontSize: "14px", color: "#6b7280" }}>{user?.email}</span>
          <button
            onClick={logout}
            style={{ padding: "8px 16px", backgroundColor: "#f3f4f6", border: "1px solid #e5e7eb", borderRadius: "8px", fontSize: "14px", cursor: "pointer", color: "#374151" }}
          >
            Sign out
          </button>
        </div>
      </div>

      <div style={{ padding: "32px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* Page title */}
        <div style={{ marginBottom: "24px" }}>
          <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#111827" }}>Dashboard</h2>
          <p style={{ color: "#6b7280", fontSize: "14px", marginTop: "4px" }}>
            {new Date().toLocaleDateString("en-PH", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>

        {/* Stats row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          {[
            { label: "Total Rooms", value: rooms.length, color: "#2563eb", bg: "#dbeafe" },
            { label: "Available", value: available, color: "#16a34a", bg: "#dcfce7" },
            { label: "Occupied", value: occupied, color: "#dc2626", bg: "#fee2e2" },
            { label: "Reserved", value: reserved, color: "#7c3aed", bg: "#ede9fe" },
            { label: "Maintenance", value: maintenance, color: "#d97706", bg: "#fef3c7" },
            { label: "Recent Revenue", value: `₱${totalRevenue.toLocaleString()}`, color: "#059669", bg: "#d1fae5" },
          ].map((stat) => (
            <div key={stat.label} style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "20px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
              <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>{stat.label}</p>
              <p style={{ fontSize: "28px", fontWeight: 700, color: stat.color }}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Check-ins and Check-outs */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "32px" }}>

          {/* Today's Check-ins */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "16px" }}>
              ✅ Today's Check-ins ({checkIns.length})
            </h3>
            {checkIns.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No check-ins today</p>
            ) : (
              checkIns.map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>{b.guestName}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280" }}>Room {b.roomNumber} · {b.roomType}</p>
                  </div>
                  <span style={{ fontSize: "12px", backgroundColor: statusBg[b.status], color: statusColor[b.status], padding: "4px 10px", borderRadius: "20px", fontWeight: 500 }}>
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Today's Check-outs */}
          <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "16px" }}>
              🚪 Today's Check-outs ({checkOuts.length})
            </h3>
            {checkOuts.length === 0 ? (
              <p style={{ color: "#9ca3af", fontSize: "14px" }}>No check-outs today</p>
            ) : (
              checkOuts.map((b) => (
                <div key={b.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #f3f4f6" }}>
                  <div>
                    <p style={{ fontSize: "14px", fontWeight: 500, color: "#111827" }}>{b.guestName}</p>
                    <p style={{ fontSize: "12px", color: "#6b7280" }}>Room {b.roomNumber} · {b.roomType}</p>
                  </div>
                  <span style={{ fontSize: "12px", backgroundColor: statusBg[b.status], color: statusColor[b.status], padding: "4px 10px", borderRadius: "20px", fontWeight: 500 }}>
                    {b.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Bookings */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", marginBottom: "32px" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "16px" }}>📋 Recent Bookings</h3>
          {recentBookings.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No bookings yet</p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "14px" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #f3f4f6" }}>
                  {["Guest", "Room", "Type", "Check-in", "Check-out", "Amount", "Status"].map((h) => (
                    <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#6b7280", fontWeight: 500, fontSize: "13px" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentBookings.map((b) => (
                  <tr key={b.id} style={{ borderBottom: "1px solid #f9fafb" }}>
                    <td style={{ padding: "12px", fontWeight: 500, color: "#111827" }}>{b.guestName}</td>
                    <td style={{ padding: "12px", color: "#374151" }}>Room {b.roomNumber}</td>
                    <td style={{ padding: "12px", color: "#374151" }}>{b.roomType}</td>
                    <td style={{ padding: "12px", color: "#374151" }}>{b.checkIn}</td>
                    <td style={{ padding: "12px", color: "#374151" }}>{b.checkOut}</td>
                    <td style={{ padding: "12px", color: "#374151" }}>₱{b.totalAmount.toLocaleString()}</td>
                    <td style={{ padding: "12px" }}>
                      <span style={{ fontSize: "12px", backgroundColor: statusBg[b.status], color: statusColor[b.status], padding: "4px 10px", borderRadius: "20px", fontWeight: 500 }}>
                        {b.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Room availability grid */}
        <div style={{ backgroundColor: "#ffffff", borderRadius: "12px", padding: "24px", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontSize: "16px", fontWeight: 600, color: "#111827", marginBottom: "8px" }}>🛏️ Room Availability</h3>
          <div style={{ display: "flex", gap: "16px", marginBottom: "16px", flexWrap: "wrap" }}>
            {[
              { label: "Available", color: "#16a34a", bg: "#dcfce7" },
              { label: "Occupied", color: "#dc2626", bg: "#fee2e2" },
              { label: "Reserved", color: "#2563eb", bg: "#dbeafe" },
              { label: "Maintenance", color: "#d97706", bg: "#fef3c7" },
            ].map((l) => (
              <div key={l.label} style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "#374151" }}>
                <div style={{ width: "12px", height: "12px", borderRadius: "3px", backgroundColor: l.bg, border: `1px solid ${l.color}` }} />
                {l.label}
              </div>
            ))}
          </div>
          {rooms.length === 0 ? (
            <p style={{ color: "#9ca3af", fontSize: "14px" }}>No rooms added yet. Add rooms in Firestore to see them here.</p>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(70px, 1fr))", gap: "8px" }}>
              {rooms.map((room) => (
                <div key={room.id} style={{
                  backgroundColor: statusBg[room.status],
                  border: `1px solid ${statusColor[room.status]}`,
                  borderRadius: "8px",
                  padding: "10px 6px",
                  textAlign: "center",
                  cursor: "pointer",
                }}>
                  <p style={{ fontSize: "13px", fontWeight: 600, color: statusColor[room.status] }}>{room.number}</p>
                  <p style={{ fontSize: "11px", color: "#6b7280", marginTop: "2px" }}>{room.type === "short-term" ? "ST" : "LT"}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}