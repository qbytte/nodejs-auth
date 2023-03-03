import { useLocation } from "wouter";

const Dashboard = () => {
  const [, setLocation] = useLocation();

  return (
    <>
      <h2>User logged in</h2>
      <button
        onClick={() => setLocation("/")}
      >Log out</button>
    </>
  );
};

export default Dashboard;
