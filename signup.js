function viewpassword(){
    let password = document.getElementById("Password")
    if(password.type ==="password"){
        password.type="text"
    }else{
        password.type="password"
    }
    let ConfirmPassword = document.getElementById("ConfirmPassword")
    if(ConfirmPassword.type ==="password"){
        ConfirmPassword.type="text"
    }else{
        ConfirmPassword.type="password"
    }
}



document.getElementById("signup-form").addEventListener("submit", async function(event){
    event.preventDefault()
    const username = document.getElementById("Username").value
    const email = document.getElementById("Email").value
    const password = document.getElementById("Password").value
    const confirmPassword = document.getElementById("ConfirmPassword").value
    if (password === confirmPassword){
        const res = await fetch("http://localhost:3000/users")
        users = await res.json()
        const email = users.find(user=> user.email===email)
        if(email){
            alert("User exists")
        }
        else{
             await fetch("://localhost:3000",{
                    method :"POST",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({username, email, password})
                })
                .then(response=>{
                    if(response.ok){
                        return response.json()
                        
                    }else{
                        throw new Error("Erro creating user:" + response.statusText)
                    }
                })
                .then(data => {
                    alert("User created successfully:", data)
                     
                })
                if(data.ok){
                    window.location.href="login.html"
                }
              }
          
    }
            
    else{
        alert("Passwords don't match")
    }
})