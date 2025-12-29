let cachedToken: string | null = null;
let tokenExpiry = 0;

export async function getShiprocketToken() {
  if (cachedToken && Date.now() < tokenExpiry) {
    return cachedToken;
  }

  const res = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const data = await res.json();

  if (!data.token) {
    throw new Error("Failed to authenticate with Shiprocket");
  }

  cachedToken = data.token;
  tokenExpiry = Date.now() + 8 * 24 * 60 * 60 * 1000; // 8 days

  return cachedToken;
}
