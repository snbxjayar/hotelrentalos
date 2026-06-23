const GHL_BASE_URL = "https://rest.gohighlevel.com/v1";
const GHL_API_KEY = import.meta.env.VITE_GHL_API_KEY;

export const ghlHeaders = {
  Authorization: `Bearer ${GHL_API_KEY}`,
  "Content-Type": "application/json",
};

// Example: Create a contact (guest) in GHL
export async function createGHLContact(guest: {
  name: string;
  email: string;
  phone: string;
}) {
  const response = await fetch(`${GHL_BASE_URL}/contacts/`, {
    method: "POST",
    headers: ghlHeaders,
    body: JSON.stringify({
      locationId: import.meta.env.VITE_GHL_LOCATION_ID,
      firstName: guest.name.split(" ")[0],
      lastName: guest.name.split(" ")[1] || "",
      email: guest.email,
      phone: guest.phone,
    }),
  });
  return response.json();
}