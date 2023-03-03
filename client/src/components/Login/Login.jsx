import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import { useState } from "react";
import "./Login.css";

const Login = () => {
  const { register, handleSubmit } = useForm();
  const [, setLocation] = useLocation();
  const [error, setError] = useState(false);

  return (
    <div className="login__container">
      <h2>Login</h2>
      <form
        onSubmit={handleSubmit((data) => {
          console.log(data);
          fetch("http://localhost:8000/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              password: data.password,
            }),
          }).then((res) => {
            res.ok ? setLocation("/dashboard") : setError(true);
          })
        })}
      >
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
      {error && <p>Wrong username or password</p>}
      <p>
        Don't have an account yet?{" "}
        <a onClick={() => setLocation("/signup")}>Sign up</a>
      </p>
    </div>
  );
};

export default Login;
