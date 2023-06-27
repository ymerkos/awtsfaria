//B"H
fetch(location.href, {
    method: "POST",
    body: "getdata=true"
}).then(r=>r.json())
.catch(e=>{
    serverMessage = "There was an error"
    console.log(e)
}).then(r=>{
    info = r;
    serverMessage.innerHTML = info.message;
    if(info.token) {
        Awtsmoos.write("tokenism", "token", info.token)
        .then(r=>{
            console.log(r)
        }).catch(e=>{
            serverMessage.innerHTML = "Problem logging in."
            console.log(e)
        })
    }
})