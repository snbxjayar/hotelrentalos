import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
} from "@mui/material";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh",
      display: "flex",
      background: "linear-gradient(135deg, #0f2d5e 0%, #1a4080 50%, #0f2d5e 100%)",
    }}>
      {/* Left panel */}
      <Box sx={{
        flex: 1,
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        px: 6,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <Box sx={{ position: "absolute", width: 400, height: 400, borderRadius: "50%", background: "rgba(255,107,74,0.08)", top: -100, left: -100 }} />
        <Box sx={{ position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "rgba(255,107,74,0.06)", bottom: -50, right: -50 }} />

        <Typography variant="h3" sx={{ color: "#ffffff", fontWeight: 800, mb: 2, textAlign: "center" }}>
          🏨 HotelRentalOS
        </Typography>
        <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.7)", textAlign: "center", maxWidth: 360, lineHeight: 1.8 }}>
          Your all-in-one platform for managing short-term and long-term hotel rentals
        </Typography>

        <Box sx={{ mt: 6, display: "flex", flexDirection: "column", gap: 2, width: "100%", maxWidth: 320 }}>
          {["Room availability at a glance", "Seamless booking management", "Guest records synced to GHL", "Revenue tracking & reports"].map((item) => (
            <Box key={item} sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: "#ff6b4a", flexShrink: 0 }} />
              <Typography sx={{ color: "rgba(255,255,255,0.8)", fontSize: 15 }}>{item}</Typography>
            </Box>
          ))}
        </Box>
      </Box>

      {/* Right panel — login form */}
      <Box sx={{
        width: { xs: "100%", md: 480 },
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: 4,
        backgroundColor: "#f0f4f8",
        borderRadius: { md: "24px 0 0 24px" },
      }}>
        <Card sx={{ width: "100%", maxWidth: 400, p: 2, borderRadius: "20px", boxShadow: "0 8px 40px rgba(0,0,0,0.12)" }}>
          <CardContent>
            <Typography variant="h5" sx={{ fontWeight: 700, color: "#0f2d5e", mb: 1 }}>
              Welcome back
            </Typography>
            <Typography variant="body2" sx={{ color: "#6b7280", mb: 4 }}>
              Sign in to manage your properties
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: "10px" }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleLogin} sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />

              <TextField
                label="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon sx={{ color: "#6b7280", fontSize: 20 }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.5,
                  fontSize: 15,
                  background: loading ? "#93c5fd" : "linear-gradient(135deg, #0f2d5e, #1a4080)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #081d3f, #0f2d5e)",
                  },
                  boxShadow: "0 4px 15px rgba(15,45,94,0.3)",
                }}
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </Box>

            <Typography variant="caption" sx={{ display: "block", textAlign: "center", mt: 3, color: "#9ca3af" }}>
              Short-term & long-term rental management
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}