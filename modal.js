let modal = document.querySelector(".modal-bg");
let closeBtn = document.querySelector("#modalCloseBtn");
let openBtn = document.querySelector("#getByUrl");

closeBtn.addEventListener('click', ()=>{
    modal.style.display = "none";
})

openBtn.addEventListener('click', ()=>{
    modal.style.display = "block";
})