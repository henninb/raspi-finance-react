import { useEffect, useState } from "react";
//import useUserLogin from "./queries/useUserLogin";
import axios from "axios";

export default function Login(props) {
  //const { mutate: userLogin } = useUserLogin();

  const [state, setState] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((previousState) => ({
      ...previousState,
      [id]: value,
    }));
  };

  const userLogin = async (payload) => {
    let endpoint = "/user/signin/";

    const response = await axios.post(endpoint, payload, {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  };

  const handleClick = async (e) => {
    console.log("login submit was clicked");
    //document.getElementById("login-result").innerHTML = "comment";

    e.preventDefault();

    //const {name, value} = e.target;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let data = {
      username: email,
      password: password,
    };
    console.log(state);
    console.log(data);

    try {
      let response = await userLogin(data);
      console.log("response: " + JSON.stringify(response));
    } catch (error) {
      console.log(error.data);
    }
  };

  useEffect(() => {});

  return (
    <div className="login centered">
      {/*<div id="login-result">test</div>*/}
      <div className="form">
        <form
          name="login-form"
          className="login-form"
          action="/user/login"
          method="POST"
          data-bitwarden-watching="1"
        >
          <span className="material-icons">lock</span>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-user form-icon" />
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              placeholder="Email"
              id="email"
              name="email"
              onChange={handleChange}
            />
          </div>
          <div className="input-group mb-3">
            <div className="input-group-prepend">
              <span className="input-group-text">
                <i className="fa fa-lock form-icon" />
              </span>
            </div>
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              id="password"
              name="password"
              onChange={handleChange}
            />
          </div>
          <button type="submit" onClick={handleClick}>
            login
          </button>
        </form>
      </div>
    </div>
  );
}
