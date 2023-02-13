import { useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "wouter";
import "./Signup.css";

const Signup = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [, setLocation] = useLocation();
  const [error, setError] = useState(false);

  return (
    <div className="signup__container">
      <h2>Sign up</h2>
      <form
        onSubmit={handleSubmit((data) => {
          fetch("http://localhost:8000/user/", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: data.username,
              password: data.password,
              name: data.name,
              lastname: data.lastname,
              phone: data.phone,
              address: data.address,
            }),
          })
            .then((res) => res.json())
            .then((data) => {
              console.log(data);
              if (data.error) setError(true);
              else setLocation("/");
            });
        })}
      >
        <input type="text" {...register("name")} placeholder="Name" required />
        <input
          type="text"
          {...register("lastname")}
          placeholder="Last name"
          required
        />
        <input
          type="text"
          {...register("username")}
          placeholder="Username"
          required
        />
        <input
          type="password"
          {...register("password", {
            pattern: /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/,
          })}
          required
          minLength={8}
          placeholder="Password"
        />
        <input
          type="text"
          {...register("phone", {
            pattern: /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
          })}
          placeholder="Phone number"
          required
          maxLength={10}
        />
        <input
          type="text"
          {...register("address")}
          placeholder="Address"
          required
        />
        {errors.password && (
          <p>
            Password must contain at least one upper case letter, one number and
            a special character
          </p>
        )}
        {errors.phone && (
          <p>
            Phone number must be 10 digits long and must contain only numbers
          </p>
        )}
        {error && <p>Username already exists</p>}
        <button type="submit">Sign up</button>
      </form>
      <p>
        Already have an account? <a onClick={() => setLocation("/")}>Log in</a>
      </p>
    </div>
  );
};

export default Signup;
