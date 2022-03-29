import { useEffect } from "react";
//import useUserLogin from "./queries/useUserLogin";
import axios from "axios";
import {endpointUrl} from "./Common";

export default function Login(props) {
  //const { mutate: userLogin } = useUserLogin();

  const userLogin = async (payload) => {
    let endpoint = endpointUrl() + "/user/signin/";

    const response = await axios.post(endpoint, payload, {
      timeout: 0,
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  }

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

    //let response = await userLogin({ payload: data });
    let response = await userLogin(data);
    console.log("response: " + JSON.stringify(response));
  };

  useEffect(() => {
  });

  return (
    <div className="login centered">
      {/*<div id="login-result">test</div>*/}
      <div className="form">
        <form
          name="login-form"
          className="login-form"
          action="/login"
          method="GET"
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
