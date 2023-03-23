import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Navbar";

const AppLogin = () => {
  const navigate = useNavigate();
  const [authenticated, setauthenticated] = useState(
    sessionStorage.getItem("authenticated") || false
  );
  const formik = useFormik({
    initialValues: {
      usernameOrEmail: "",
      password: "",
    },
    validationSchema: Yup.object({
      usernameOrEmail: Yup.string().required(),
      password: Yup.string().required().min(4),
    }),
    onSubmit: (data) => {
      const { usernameOrEmail, password } = data;
      const isEmail = usernameOrEmail.includes("@");
      const authData = isEmail
        ? { email: usernameOrEmail, password: password }
        : { username: usernameOrEmail, password: password };
      axios
        .post(`http://colormag.local/wp-json/jwt-auth/v1/token`, authData)
        .then((res) => {
          console.log("response", res);
          if (res.status === 200 && res.statusText === "OK") {
            setauthenticated(true);
            sessionStorage.setItem("authenticated", true);
            alert("Welcome " + res.data.user_nicename);
            navigate("/Dashboard");
          }
        })
        .catch((err) => {
          console.log("error:", err.message);
          alert("Invalid user");
        });
    }
  })
  return (
    <>
    <Navbar />
      <div className="col-3 mt-5 container">
        <h1>Login Page</h1>
        <form onSubmit={formik.handleSubmit}>
          <label htmlFor="usernameOrEmail">Username or Email</label>
          <input
            id="usernameOrEmail"
            name="usernameOrEmail"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.usernameOrEmail}
          />
          {formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? (
            <div>{formik.errors.usernameOrEmail}</div>
          ) : null}
          <br />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  );
};
export default AppLogin;