const loaderReg = document.querySelector(".loader__registration");

const checkLabel = (labelId) => {
  const label = document.querySelector(`#${labelId}`);
  label.addEventListener("change", (e) => {
    const { value } = e.target;
    if (value) {
      label.classList.add("field");
    } else {
      label.classList.remove("field");
    }
  });
};

const checkUserData = async (data, url) => {
  loaderReg.classList.add("active-loader");
  const answer = await fetch(`https://clothes-api-eta.vercel.app/${url}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
};

const addNewUser = async (data) => {
  const answer = await fetch(`https://clothes-api-eta.vercel.app/add-user`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });
  return await answer.json();
};

const removeErrorMsg = (node) => {
  if (node.classList.contains("active-error")) {
    node.classList.remove("active-error");
  }
};

const windowRegistration = document.querySelector(".windowRegistration");
const contentReg = document.querySelector(
  ".windowRegistration__contentRegistr"
);
const iconLoginOrSign = document.querySelector(".header__log");

const closeWindowRegistration = () => {
  windowRegistration.classList.remove("active-windowRegistr");
  contentReg.classList.remove("active-contentRegisctr");
};

iconLoginOrSign.addEventListener("click", () => {
  windowRegistration.classList.add("active-windowRegistr");
  contentReg.classList.add("active-contentRegistr");
});

windowRegistration.addEventListener("click", (e) => {
  const formSignOn = document.querySelector(".contentRegistr__formSign");
  const formLogIn = document.querySelector(".contentRegistr__formReg");

  // const from log in
  const labelNameLog = document.querySelector("#name");
  const labelPasswordLog = document.querySelector("#password");
  const nameErrorLog = document.querySelector("#error-name");
  const passwordErrorLog = document.querySelector("#error-password");

  // const from Sign on
  const labelNameSign = document.querySelector("#_name");
  const labelPasswordSign = document.querySelector("#_password");
  const labelEmailSign = document.querySelector("#_email");
  const nameErrorSign = document.querySelector("#error_name");
  const emailErrorSign = document.querySelector("#error_email");
  const passwordErrorSign = document.querySelector("#error_password");

  const iconLog = document.querySelector(".header__log");
  const iconAccount = document.querySelector(".header__account");

  const resetInputsStyles = () => {
    labelNameLog.classList.remove("error", "field");
    labelPasswordLog.classList.remove("error", "field");
    removeErrorMsg(nameErrorLog);
    removeErrorMsg(passwordErrorLog);

    labelNameSign.classList.remove("error", "field");
    labelPasswordSign.classList.remove("error", "field");
    labelEmailSign.classList.remove("error", "field");
    removeErrorMsg(nameErrorSign);
    removeErrorMsg(emailErrorSign);
    removeErrorMsg(passwordErrorSign);
  };

  checkLabel("name");
  checkLabel("password");
  checkLabel("_name");
  checkLabel("_email");
  checkLabel("_password");
  if (
    e.target.classList.contains("windowRegistration") ||
    e.target.classList.contains("contentRegistr__imgClose")
  ) {
    closeWindowRegistration();
    formLogIn.reset();
    formSignOn.reset();
    resetInputsStyles();
  }
  if (e.target.classList.contains("actions__logIn")) {
    if (formLogIn.classList.contains("active-form")) {
      loaderReg.classList.add("active-loader");
      e.preventDefault();
      const formData = new FormData(formLogIn);
      const entries = formData.entries();
      const data = Object.fromEntries(entries);

      checkUserData(data, "find-user").then((res) => {
        loaderReg.classList.remove("active-loader");
        if (!res.isFound) {
          labelNameLog.classList.add("error");
          labelPasswordLog.classList.add("error");

          nameErrorLog.classList.add("active-error");
          nameErrorLog.innerText = "Name is not right";

          passwordErrorLog.classList.add("active-error");
          passwordErrorLog.innerText = "Pssword is not right";
        } else {
          iconLog.classList.remove("active-icon");
          iconAccount.classList.add("active-icon");

          resetInputsStyles();

          labelNameLog.classList.add("field");
          labelPasswordLog.classList.add("field");

          localStorage.setItem("token", res.token);

          setTimeout(() => {
            formLogIn.reset();
            resetInputsStyles();
            closeWindowRegistration();
          }, 2000);
        }
      });
    } else {
      formSignOn.classList.remove("active-form");
      formLogIn.classList.add("active-form");
      formSignOn.reset();
      resetInputsStyles();
    }
  }
  if (e.target.classList.contains("actions__signOn")) {
    if (formSignOn.classList.contains("active-form")) {
      e.preventDefault();
      const formData = new FormData(formSignOn);
      const entries = formData.entries();
      const userData = Object.fromEntries(entries);

      userData.role = "user";
      // validation Name
      if (userData.name.length < 4) {
        labelNameSign.classList.add("error");
        e;
        nameErrorSign.classList.add("active-error");
        nameErrorSign.innerText = "Min length is 4 symbols";
      } else {
        labelNameSign.classList.remove("error");
        nameErrorSign.classList.remove("active-error");
      }

      // validation Password

      if (userData.password.length < 8) {
        labelPasswordSign.classList.add("error");
        passwordErrorSign.classList.add("active-error");
        passwordErrorSign.innerText = "Min length is 8 symbols";
      } else {
        labelPasswordSign.classList.remove("error");
        passwordErrorSign.classList.remove("active-error");
      }

      // validation email

      const regEmail = new RegExp(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g);

      if (!regEmail.test(userData.email)) {
        labelEmailSign.classList.add("error");
        emailErrorSign.classList.add("active-error");
        emailErrorSign.innerText = "Email is not valid";
      } else {
        labelEmailSign.classList.remove("error");
        emailErrorSign.classList.remove("active-error");
      }

      const isValidation =
        !labelEmailSign.classList.contains("error") &&
        !labelNameSign.classList.contains("error") &&
        !labelPasswordSign.classList.contains("error");

      if (isValidation) {
        checkUserData(userData, "create-user").then((data) => {
          loaderReg.classList.remove("active-loader");
          if (!data.name) {
            labelNameSign.classList.add("error");
            nameErrorSign.classList.add("active-error");
            nameErrorSign.innerText = "This name is used";
          } else {
            labelNameSign.classList.remove("error");
            nameErrorSign.classList.remove("active-error");
          }
          if (!data.email) {
            labelEmailSign.classList.add("error");
            emailErrorSign.classList.add("active-error");
            emailErrorSign.innerText = "This email is used";
          } else {
            labelEmailSign.classList.remove("error");
            emailErrorSign.classList.remove("active-error");
          }
          if (data.name && data.email) {
            addNewUser(userData);
            formSignOn.reset();
            labelNameSign.classList.remove("field");
            labelPasswordSign.classList.remove("field");
            labelEmailSign.classList.remove("field");
            localStorage.setItem("token", JSON.stringify(data.token));
            closeWindowRegistration();

            iconLog.classList.remove("active-icon");
            iconAccount.classList.add("active-icon");
          }
        });
      }
    } else {
      formLogIn.classList.remove("active-form");
      formSignOn.classList.add("active-form");
      formLogIn.reset();
      resetInputsStyles();
    }
  }
});
