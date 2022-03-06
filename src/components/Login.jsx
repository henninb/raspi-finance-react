import { Formik, Field, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import AuthService from "./AuthService";

export default function Login() {
  // export default class Login extends Component<Props, State> {
  //     ...
  function validationSchema() {
    return Yup.object().shape({
      username: Yup.string().required("This field is required!"),
      password: Yup.string().required("This field is required!"),
    });
  }

  function handleLogin(formValue) {
    const { email, password } = formValue;
    console.log("email: " + email);
    console.log("password: " + password);
    //...
  }

  const initialValues = {
    email: "",
    password: "",
  };

  const message = "";
  const loading = false;

  return (
    <div className="container1 rootContainer login-formatting">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleLogin}
      >
        <Form>
          <h1>Login</h1>
          <div className="flex container1">
            {/*<input className="rounded" placeholder="Email"/>*/}
            <Field
              name="email"
              placeholder="Email"
              type="text"
              className="rounded"
            />
            {/*<input className="rounded" placeholder="Password"/>*/}
            <Field
              name="password"
              placeholder="Password"
              type="password"
              className="rounded"
            />
          </div>
          <p>
            Forgot password? <a className="resetBtn">Reset it</a>
          </p>
          <button className="rounded loginBtn" type="submit">
            Login
          </button>
        </Form>
      </Formik>
    </div>

    // <div className="login-formatting">
    //   <div
    //     style={{
    //       backgroundColor: "white",
    //     }}
    //   >
    //     <Formik
    //       initialValues={initialValues}
    //       validationSchema={validationSchema}
    //       onSubmit={handleLogin}
    //     >
    //       <Form>
    //         <div className="form-group">
    //           <label htmlFor="username">Username</label>
    //           <Field name="username" type="text" className="form-control" />
    //           <ErrorMessage
    //             name="username"
    //             component="div"
    //             className="alert alert-danger"
    //           />
    //         </div>
    //         <div className="form-group">
    //           <label htmlFor="password">Password</label>
    //           <Field name="password" type="password" className="form-control" />
    //           <ErrorMessage
    //             name="password"
    //             component="div"
    //             className="alert alert-danger"
    //           />
    //         </div>
    //         <div className="form-group">
    //           <button
    //             type="submit"
    //             className="btn btn-primary btn-block"
    //             disabled={loading}
    //           >
    //             {loading && (
    //               <span className="spinner-border spinner-border-sm"></span>
    //             )}
    //             <span>Login</span>
    //           </button>
    //         </div>
    //         {message && (
    //           <div className="form-group">
    //             <div className="alert alert-danger" role="alert">
    //               {message}
    //             </div>
    //           </div>
    //         )}
    //       </Form>
    //     </Formik>
    //   </div>
    // </div>
  );
}
