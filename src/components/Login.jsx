import react, { useEffect } from "react";
//import axios from "axios";

// function componentDidMount() {
//    // axios.get(`https://jsonplaceholder.typicode.com/users`)
//    axios.get("api/login")
//      .then(res => {
//        const persons = res.data;
//        alert(persons);
//        // this.setState({ persons });
//      })
//  }

export default function Login(props) {
  // export const Login = (props) => {

  const signupWasClickedCallback = (data) => {
    console.log(data);
    // axios({
    // method: 'post',
    // url: '/login',
    // data: {
    // firstName: 'Finn',
    // lastName: 'Williams'
    // }
    // });
    //alert('Signup callback, see log on the console to see the data.');
  };

  const handleClick = (e) => {
    console.log("login submit was clicked");
  };

  const updateData = (e) => {
    console.log("form changed");
  };

  useEffect(() => {
    // Update the document title using the browser API
    // document.title = `You clicked ${count} times`;
  });

  return (
    <div className="login">
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
                <i className="fa fa-user form-icon"></i>
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
                <i className="fa fa-lock form-icon"></i>
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
          <button type="submit">login</button>
        </form>
      </div>
    </div>
  );
}
