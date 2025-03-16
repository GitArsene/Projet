document.getElementById("horsesGET").addEventListener("click", async function() {
    let horsesGET = document.createElement("p");
    horsesGET.innerHTML = await fetchHorsesGET();
    document.getElementById("horsesGET").after(horsesGET);
});

async function fetchHorsesGET(){
    const response = await fetch('http://localhost:3000/api/horsesGET');
    const data = await response.text();

    return data;
}