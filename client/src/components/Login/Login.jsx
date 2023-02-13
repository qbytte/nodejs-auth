import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import "./Login.css";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [, setLocation] = useLocation();

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit()}>
        <input
          type="text"
          {...register("username")}
          placeholder="Username"
          required
        />
        <input
          type="password"
          {...register("password")}
          required
          placeholder="Password"
        />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account yet?{" "}
        <a onClick={() => setLocation("/signup")}>Sign up</a>
      </p>
    </div>
  );
};

export default Login;
