
function viewPassword(){
    let password = document.getElementById("password")
    if(password.type==="password"){
        password.type="text"
    }
    else{
        password.type="password"
    }}
    


document.getElementById("login-form").addEventListener("submit",async function(event){
    event.preventDefault()
    const username = document.getElementById("username").value.trim();
    const Email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const res = await fetch("http://localhost:4000/users")
    if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
    }


   const users = await res.json()
   console.log(users)
   const user = users.find(user=> user.username===username  && user.password === password );
   console.log(user.email+ user.password+user.username)
   if(user){
     window.location.href="play.html"
    }
   else{
    alert("Invalid email or password")
   }


    })

