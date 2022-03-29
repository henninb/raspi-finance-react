import { useEffect } from "react";
import useUserLogin from "./queries/useUserLogin";

export default function Login(props) {
  const { mutate: userLogin } = useUserLogin();

  const handleClick = async (e) => {
    console.log("login submit was clicked");
    document.getElementById("login-result").innerHTML = "comment";

    //e.target.name

    e.preventDefault();

    //var formData = new FormData();
    //const data = new FormData(e.target);
    //alert(e.target.name);
    //alert(e.target.value.trim());

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let data = {
      username: email,
      password: password,
    };

    let response = await userLogin({ payload: data });
    console.log(response);
  };

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
  });

  return (
    <div className="login centered">
      <div id="login-result">test</div>
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
