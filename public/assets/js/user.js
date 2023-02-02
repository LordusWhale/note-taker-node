

async function showServerError() {
  const error = document.querySelector('.error-message');
  error.style.transform = "translateY(80px)";
  error.innerText = "Server error please try again";
  await new Promise(r => setTimeout(r, 5000));
  error.style.transform = "translateY(0)";
 
}

async function getUser() {
  let user;
  await fetch("/api/user", { credentials: "include" })
    .then((res) => res.json())
    .then((data) => {
      if (data.loggedIn) {
        user = data.username;
      }
    })
    .catch(async () =>{
      await showServerError();
    })
    return user;
}

const showError = (message) => {
  $("#error").text(message);
}

export async function init() {
  const user = await getUser();
  if (!user) {
    $('.login').attr('class', 'fas fa-user text-light login')
    $(".login").click(() => {
      $("#modalRegisterForm").modal("show");
      login();
    });
  } else {
    $('.login').attr('class', 'text-center text-light text-sm-left login')
    $('.login').text('Logout');
    $('.login').click(async ()=>{
      await fetch('/api/user', {
        method: "DELETE",
        credentials: "include"
      })
      .then(()=>{
        window.location.reload();
      }).catch(async () => {
        await showServerError();
      })
    })
  }

}

function register() {
  $(".modal-content").html(generateRegister());

  $(".register").click(async (e) => {
    const username = $("#username").val();
    const password = $("#password").val();
    if (username.trim() === "" || password.trim() === "") {
      showError("Enter username/password");
      return;
    }
    const confirmPassword = $("#confirm-password").val();
    if (password.trim() !== confirmPassword.trim()) {
      showError("Password does not match");
      return;
    }
    if (username.length < 5) {
      showError("Username must be 5 characters or more");
      return;
    }
    if (password.length < 6) {
      showError("Password length must be 6 characters or more")
      return;
    }
    await fetch("/api/user/register", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
        if (data.message) {
          $("#error").text(data.message);
        } else {
          window.location.reload();
        }
      })
      .catch(async ()=>{
        await showServerError()
      })
  });
  $(".login").click(() => {
    login();
  });
}

function login() {
  $(".modal-content").html(generateLogin());
  $("#login").click(async () => {
    const username = $("#username").val();
    const password = $("#password").val();
    if (!password.trim() || !username.trim()) {
      $("#error").text("Enter username/password");
      return;
    }
    await fetch("/api/user/login", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) {
          $("#error").text(data.message);
        } else {
          window.location.reload();
        }
      })
      .catch(async ()=>{
        await showServerError();
      })
  });

  $(".register").click(() => {
    register();
  });
}

function generateLogin() {
  return `
      <div class="modal-header text-center">
      <h4 class="modal-title w-100 font-weight-bold">Log in</h4>
   
    </div>
    <div class="modal-body mx-3">
      <div class="md-form mb-5">
        <i class="fas fa-user prefix grey-text"></i>
        <input type="text" id="username" class="form-control validate">
        <label data-error="wrong" data-success="right" for="username">Your name</label>
      </div>
  
      <div class="md-form mb-4">
        <i class="fas fa-lock prefix grey-text"></i>
        <input type="password" id="password" class="form-control validate">
        <label data-error="wrong" data-success="right" for="password">Your password</label>
      </div>
      <p id="error"></p>
    </div>
    <div class="modal-footer d-flex flex-column justify-content-center">
      <button class="btn btn-deep-orange" id="login">Login</button>
      <button class="btn btn-deep-orange register">Not a user? Register here</button>
    </div>
      `;
}

function generateRegister() {
  return `
    <div class="modal-header text-center">
    <h4 class="modal-title w-100 font-weight-bold">Sign up</h4>
 
  </div>
  <div class="modal-body mx-3">
    <div class="md-form mb-5">
      <i class="fas fa-user prefix grey-text"></i>
      <input type="text" id="username" class="form-control validate">
      <label data-error="wrong" data-success="right" for="username">Your name</label>
    </div>

    <div class="md-form mb-4">
      <i class="fas fa-lock prefix grey-text"></i>
      <input type="password" id="password" class="form-control validate">
      <label data-error="wrong" data-success="right" for="password">Your password</label>
    </div>

    <div class="md-form mb-4">
    <i class="fas fa-lock prefix grey-text"></i>
    <input type="password" id="confirm-password" class="form-control validate">
    <label data-error="wrong" data-success="right" for="confirm-password">Confirm password</label>
  </div>
  <p id="error"></p>
  </div>
  <div class="modal-footer d-flex flex-column justify-content-center">
    <button class="btn btn-deep-orange register">Register</button>
    <button class="btn btn-deep-orange login">Login</button>
  </div>
    `;
}
