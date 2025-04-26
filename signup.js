function viewpassword(){
    let Password = document.getElementById("Password")
    if(Password.type ==="password"){
        Password.type="text"
    }else{
        Password.type="password"
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
        const res = await fetch("http://localhost:4000/users")
        const users = await res.json()
        const emails = users.find(user=> user.email===email)
        if(emails){
            alert("User exists")
        }
        else{
             await fetch("http://localhost:4000/users",{
                    method :"POST",
                    headers:{'Content-Type':'application/json'},
                    body: JSON.stringify({username, email, password})
                })
                .then(response=>{
                    if(response.ok){
                        window.location.href="login.html"
                        return response.json()
                        
                
                    }else{
                        throw new Error("Erro creating user:" + response.statusText)
                    }
                })
                .then(data => {
                    alert("User created successfully:"+ (data));
                    window.location.href="login.html"
                     
                })
                
              }
          
    }
            
    else{
        alert("Passwords don't match")
    }
})