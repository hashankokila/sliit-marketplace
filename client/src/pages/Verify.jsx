import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api";

export default function Verify() {
  const { token } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const called = useRef(false); // React StrictMode runs effects twice in dev; the token only works once

  useEffect(() => {
    if (called.current) return;
    called.current = true;

    api
      .get(`/auth/verify/${token}`)
      .then((res) => { setStatus("ok"); setMessage(res.data.message); })
      .catch((err) => { setStatus("error"); setMessage(err.response?.data?.message || "Verification failed"); });
  }, [token]);

  return (
    <div className="card">
      {status === "loading" && <p>Verifying...</p>}
      {status !== "loading" && <p className={status === "error" ? "error" : ""}>{message}</p>}
      {status === "ok" && <Link to="/login">Log in</Link>}
    </div>
  );
}