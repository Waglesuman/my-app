import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../Navbar";

//formik use to pass form value and validation
//yup use for authorization and authentication.

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
            const { user_nicename , user_email } = res.data;
            localStorage.setItem("userEmail", user_email);
            sessionStorage.setItem("authenticated", true);
            setauthenticated(true);
            alert("Welcome " + res.data.user_email);
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
    <div className="col-12 col-md-6 col-lg-4 container mt-5">
  <h1 className="mb-4">Login Page</h1>
  <form onSubmit={formik.handleSubmit}>
    <div className="form-group">
      <label htmlFor="usernameOrEmail">Username or Email</label>
      <input
        id="usernameOrEmail"
        name="usernameOrEmail"
        type="text"
        className={`form-control ${
          formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? 'is-invalid' : ''
        }`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.usernameOrEmail}
      />
      {formik.touched.usernameOrEmail && formik.errors.usernameOrEmail ? (
        <div className="invalid-feedback">{formik.errors.usernameOrEmail}</div>
      ) : null}
    </div>
    <div className="form-group">
      <label htmlFor="password">Password</label>
      <input
        id="password"
        name="password"
        type="password"
        className={`form-control ${
          formik.touched.password && formik.errors.password ? 'is-invalid' : ''
        }`}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        value={formik.values.password}
      />
      {formik.touched.password && formik.errors.password ? (
        <div className="invalid-feedback">{formik.errors.password}</div>
      ) : null}
    </div>
    <button type="submit" className="btn btn-primary mt-3">Submit</button>
  </form>
</div>

    </>
  );
};
export default AppLogin;