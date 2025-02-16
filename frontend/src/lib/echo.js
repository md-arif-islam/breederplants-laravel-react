import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Make Pusher available globally to Echo
window.Pusher = Pusher;

// Retrieve token from localStorage (or your store)
const token = localStorage.getItem("token");

const echo = new Echo({
  broadcaster: "pusher",
  key: "104b0afcde18714f6014", // Your Pusher key
  cluster: "eu", // Your Pusher cluster
  forceTLS: true, // Use TLS
  encrypted: true,

  // The important part: point to your Laravel app's broadcasting auth route
  authEndpoint: "http://127.0.0.1:8000/broadcasting/auth",

  // Send the Bearer token in headers for private channel auth
  auth: {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
    // If you're using cookies + Sanctum, you might do:
    withCredentials: true,
    withXSRFToken: true,
  },
});

export default echo;
