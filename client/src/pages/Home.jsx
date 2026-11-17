import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user, logout } = useAuth();
  return (
    <div className="card">
      <h2>Welcome, {user.name}</h2>
      <p>{user.email} · {user.campus} campus</p>
      <button onClick={logout}>Log out</button>
    </div>
  );
}