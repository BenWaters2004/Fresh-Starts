function hashing(password) {
    //hashes password
    var hash = 0,
        i, chr;
    for (i = 0; i < password.length; i++) {
        chr = password.charCodeAt(i); //converts each character to its character code
        hash = ((hash << 5) - hash) + chr; //preforms 5 binary shifts to the left
        hash |= 0; // Convert to 32bit integer
    }
    hash = btoa(hash); //encrypts with base 64
    return hash;
}

function setFormMessage(formElement, type, message) {
    //Updates the forms error message/success message
    const messageElement = formElement.querySelector(".Message");

    messageElement.textContent = message;
    messageElement.classList.remove("Message--success", "Message--error");
    messageElement.classList.add(`Message--${type}`);
}

function setInputError(inputElement, message) {
    //adds error message to individual inputs (Only on signup)
    inputElement.classList.add("input--error");
    inputElement.parentElement.querySelector(".input-error-message").textContent = message;
}

function clearInputError(inputElement) {
    //clears errors once user types inside of the input
    inputElement.classList.remove("input--error");
    inputElement.parentElement.querySelector(".input-error-message").textContent = "";
}

document.addEventListener("DOMContentLoaded", () => { //When page is loaded
    //Allows it to get a refrence for the link to switch between login and signup
    //also refrences other classes that are editted
    const loginForm = document.querySelector("#login");
    const createAccountForm = document.querySelector("#createAccount");
    const help = document.querySelector("#help");
    const helpButton = document.querySelector("#helpButton");
    const backButton = document.querySelector("#backButton");
    const backBlur = document.querySelector(".BackgroundBlur");
    const PageTitle = document.querySelector(".PageTitle");
    const WhiteBox = document.querySelector(".WhiteBox");
    const LoggedIn = document.querySelector(".LoggedIn");

    //Switches between forms, when user clicks the link
    document.querySelector("#linkCreateAccount").addEventListener("click", e => {
        e.preventDefault(); //Prevents it from acting like a link and redirecting you
        loginForm.classList.add("form--hidden");
        help.classList.add("form--hidden");
        createAccountForm.classList.remove("form--hidden");
    });

    document.querySelector("#linkLogin").addEventListener("click", e => {
        e.preventDefault(); //Prevents it from acting like a link and redirecting you
        loginForm.classList.remove("form--hidden");
        help.classList.add("form--hidden");
        createAccountForm.classList.add("form--hidden");
    });

    document.querySelector("#helpButton").addEventListener("click", e => {
        e.preventDefault(); //Prevents it from acting like a link and redirecting you
        help.classList.remove("form--hidden");
        helpButton.classList.add("form--hidden");
        backButton.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
        loginForm.classList.add("form--hidden");
    });

    document.querySelector("#backButton").addEventListener("click", e => {
        e.preventDefault(); //Prevents it from acting like a link and redirecting you
        loginForm.classList.remove("form--hidden");
        help.classList.add("form--hidden");
        helpButton.classList.remove("form--hidden");
        createAccountForm.classList.add("form--hidden");
        backButton.classList.add("form--hidden");
    });

    //attempts to log user in if details are correct
    loginForm.addEventListener("submit", e => {
        e.preventDefault();

        //sets inputs as variables
        const LoginUsername = loginForm.elements['LoginUsername'];
        let username = LoginUsername.value;

        const LoginPassword = loginForm.elements['LoginPassword'];
        let password = LoginPassword.value;

        //hashes password
        hash = hashing(password);

        var users = JSON.parse(localStorage.getItem('UserLogins')); //gets array of all users
        for (var i = 0; i < users.length; i++) {
            //removes salt from each password to check if they match
            var currPassword = users[i].password;
            currPassword = currPassword.split("$"); //splits password at $ as base 64 does not use $
            currPassword = currPassword[0] + currPassword[2]; //pairs section before salt and after salt back together

            if (users[i].username == username && currPassword == hash) {
                //if user is found takes them to the main page
                WhiteBox.classList.add("form--hidden");
                backBlur.classList.add("form--hidden");
                PageTitle.classList.add("form--hidden");
                LoggedIn.classList.remove("form--hidden");
                document.getElementById("LoggedIn").textContent = "You are now logged in as " + username;
                sessionStorage.setItem("username", username);
            }
        }

        //if login details entered are incorrect
        setFormMessage(loginForm, "error", "Login details are incorrect!");
    });

    //attempts to create user details if details are acceptable
    createAccountForm.addEventListener("submit", e => {
        e.preventDefault();

        //sets each input as variable
        const signUpUsername = createAccountForm.elements['signupUsername'];
        let username = signUpUsername.value;

        const signUpPassword = createAccountForm.elements['signupPassword1'];
        let password = signUpPassword.value;

        const signUpPassword2 = createAccountForm.elements['signupPassword2'];
        let password2 = signUpPassword2.value;

        const signUpUni = createAccountForm.elements['signupUniversity'];
        let uni = signUpUni.value;

        const signUpCourse = createAccountForm.elements['signupCourse'];
        let course = signUpCourse.value;

        //Input validation after submit
        var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
        var badWords = ['fuck', 'shit', 'crap', 'bitch'];
        let signupAcceptable = true;

        //loops through to find the username already exists
        var users = JSON.parse(localStorage.getItem('UserLogins')); //gets array of all users
        if (users != null) {
            for (var i = 0; i < users.length; i++) {
                if (users[i].username == username) {
                    signupAcceptable = false;
                    setInputError(signupUsername, "Username already exists");
                    setFormMessage(createAccountForm, "error", "Details are not acceptable");
                }
            }
        }
        //checks username length
        if (username.length < 3 || username.length > 12) {
            signupAcceptable = false;
            setInputError(signupUsername, "Username must be at least 3 characters and less than 12 characters long");
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        //checks if username involves special characters
        if (specialCharacters.test(username)) {
            signupAcceptable = false;
            setInputError(signupUsername, "Username must not contain special characters");
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        //checks if username involves bad words
        for (var i = 0; i < badWords.length; i++) {
            if ((username.toLowerCase()).includes(badWords[i])) {
                signupAcceptable = false;
                setInputError(signupUsername, "Username contains inappropriate words");
                setFormMessage(createAccountForm, "error", "Details are not acceptable");
            }
        }
        //checks password length
        if (password.length < 8 || password.length > 16) {
            signupAcceptable = false;
            setInputError(signupPassword1, "Password must be at least 8 characters and less than 16 characters long");
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        //checks both passwords entered match to prevent spelling errors
        if (password != password2) {
            signupAcceptable = false;
            setInputError(signupPassword2, "Passwords don't match");
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        console.log(uni);
        if (uni == "University Choice") {
            signupAcceptable = false;
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        //checks course length
        if (course.length < 3 || course.length > 20) {
            signupAcceptable = false;
            setInputError(signupCourse, "Course name must be at least 3 characters and less than 20 characters long");
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        //checks if course involves special characters
        if (specialCharacters.test(course)) {
            signupAcceptable = false;
            setInputError(signupCourse, "Course must not contain special characters");
            setFormMessage(createAccountForm, "error", "Details are not acceptable");
        }
        
        //if user details are acceptable
        if (signupAcceptable === true) {

            //hashes password
            hash = hashing(password);
            var salt = "$" + (Math.random() + 1).toString(36).substring(7) + "$"; //generates a random string of 5 char
            //seperated with $ as base 64 dosnt use these and so it can be more easily split to check if password is correct
            var rnd = Math.floor(Math.random() * (hash.length)); //generates random positon in string
            hash = [hash.slice(0, rnd), salt, hash.slice(rnd)].join(''); //adds salt to random position in string

            //switches to login and prepopulates the inputs
            loginForm.classList.remove("form--hidden");
            createAccountForm.classList.add("form--hidden");
            setFormMessage(loginForm, "success", "Account created, please login");
            document.getElementById('LoginUsername').setAttribute('value', username);
            document.getElementById('LoginPassword').setAttribute('value', password);
        }
    });


    //Input Validation before submitting
    document.querySelectorAll(".input").forEach(inputElement => {
        var specialCharacters = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/; //special chaaracters to test against
        //below are some bad words so that users cant have these as their usernames
        //More can be added but to demostrate some basic swear words have been added
        var badWords = ['fuck', 'shit', 'crap', 'bitch'];

        inputElement.addEventListener("blur", e => {
            //checks username length
            if (e.target.id === "signupUsername" && e.target.value.length < 3 || e.target.value.length > 12) {
                setInputError(inputElement, "Username must be at least 3 characters and less than 12 characters long");
            }
            //checks if username involves special characters
            if (e.target.id === "signupUsername" && specialCharacters.test(e.target.value)) {
                setInputError(inputElement, "Username must not contain special characters");
            }
            //checks if username involves bad words
            if (e.target.id === "signupUsername") {
                for (var i = 0; i < badWords.length; i++) {
                    if (((e.target.value).toLowerCase()).includes(badWords[i])) {
                        setInputError(signupUsername, "Username contains inappropriate words");
                    }
                }
            }
            //checks password length
            if (e.target.id === "signupPassword1" && e.target.value.length < 8 || e.target.value.length > 16) {
                setInputError(inputElement, "Password must be at least 8 characters and less than 16 characters long");
            }
            //checks course length
            if (e.target.id === "signupCourse" && e.target.value.length < 3 || e.target.value.length > 20) {
                setInputError(inputElement, "Course name must be at least 3 characters and less than 20 characters long");
            }
            //checks if course involves special characters
            if (e.target.id === "signupCourse" && specialCharacters.test(e.target.value)) {
                setInputError(inputElement, "Course name must not contain special characters");
            }
        });

        //clears errors once user types inside of the input
        inputElement.addEventListener("input", e => {
            clearInputError(inputElement);
        });
    });
});
