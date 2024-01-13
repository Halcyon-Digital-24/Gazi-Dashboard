import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./index.scss";
import { Button } from "../../components/button";
import { useForm } from "react-hook-form"
import { useQuery } from '@tanstack/react-query'

function Login() {

  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = (data) => console.log(data)



  return (
    <div className="login-page">
      <section className="heading">
        <img src="/assets/logo/logo.png" alt="logo" />
      </section>

      <section className="form">
        <form onSubmit={handleSubmit(onSubmit)}>
          <label>Email</label>
          <input
            placeholder="Enter your email"
            type="email"
            {...register("email", { required: "Email Address is required", pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
              message: "Invalid email address",
            }, })}
          />
                {errors.email && <p className="validation__error">{errors.email.message}</p>}

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            {...register("password", { required: "Password is required" })}
          />
            {errors.password && <p className="validation__error">{errors.password.message}</p>}
            
          <div className="form-group">
            <Button className="submit-btn" type="submit">Submit</Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
