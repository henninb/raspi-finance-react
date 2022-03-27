import { useEffect } from "react";

export default function Login(props) {

  const handleClick = (e) => {
    console.log("login submit was clicked");
    document.getElementById("login-result").innerHTML = "comment";
  };
  
  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
  });

  return (
      <div className="login centered">
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
            <button type="submit" onClick={handleClick}>login</button>
          </form>
        </div>
      </div>
  );
}