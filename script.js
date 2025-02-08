let start = document.querySelector('.start')
let start_btn = document.querySelector('.start-btn')
let canvas = document.querySelector('.canvas')
let board = document.querySelector('.board')

// Доступы к кнопкам на холсте
let draw_btn = document.querySelector('.draw_btn')
let delete_btn = document.querySelector('.delete_btn')
let fill_btn = document.querySelector('.fill_btn')
let reset_btn = document.querySelector('.reset_btn')
let save_btn = document.querySelector('.save_btn')
let input = document.querySelector('.color_input')
let download_btn = document.querySelector('.download_btn')

let current_color = "black"
let is_delete = false
let is_mouseDown = false

start_btn.addEventListener('click', function(){
    start.style.display = 'none'
    canvas.style.display = 'flex'
    create_board()
})

// Создаем рабочую доску
function create_board() {
    board.innerHTML = ''
    for (let i=0; i<1024; i+=1) {
        let cells = document.createElement('div')
        cells.classList.add('cell')
        board.appendChild(cells)
        cells.addEventListener("mousedown", function(){
            current_color = input.value
            cells.style.backgroundColor = is_delete ? "" : current_color
            cells.style.borderTop = "1px solid black"
            cells.style.borderLeft = "1px solid black"
        })
        cells.addEventListener("mousemove", function(){
            if (is_mouseDown){
                cells.style.backgroundColor = is_delete ? "" : current_color
                cells.style.borderTop = "1px solid black"
                cells.style.borderLeft = "1px solid black"
            }
        })
    }
    let save_picture = JSON.parse(localStorage.getItem("picture"))
    if (save_picture) {
        document.querySelectorAll(".cell").forEach((cell, index) => {
            cell.style.backgroundColor = save_picture[index] || ""
        })
    }
}

input.addEventListener("click", function(event){
    current_color = event.target.value
    is_delete = false
})

delete_btn.addEventListener("click", function(){
    is_delete = true
})

draw_btn.addEventListener("click", function(){
    is_delete = false

    // Для обучения
    current_color = input.value
})

fill_btn.addEventListener("click", function(){
    current_color = input.value
    let cells = document.querySelectorAll(".cell")
    // Без анимации
    // cells.forEach((cell)=>{
    //     cell.style.backgroundColor = current_color
    // }) 

    // С анимацией
    anime({
        targets: cells,
        backgroundColor: current_color,
        duration: 500,
        delay: anime.stagger(0.5),
        easing: "linear",
    })
})

reset_btn.addEventListener("click", function(){
    let cells = document.querySelectorAll(".cell")
    cells.forEach((cell)=>{
        cell.style.backgroundColor = ""
    }) 
})

board.addEventListener("mousedown", function(){
    is_mouseDown = true
})

board.addEventListener("mouseup", function(){
    is_mouseDown = false
})

save_btn.addEventListener("click", function(){
    let cells = document.querySelectorAll('.cell')
    let cells_colors = []
    cells.forEach((cell) => {
        cells_colors.push(cell.style.backgroundColor || "")
    })
    localStorage.setItem("picture", JSON.stringify(cells_colors))
})

download_btn.addEventListener('click', function() {
    let canvas_export = document.createElement("canvas")
    canvas_export.width = 1024
    canvas_export.height = 1024
    let context = canvas_export.getContext("2d")
    document.querySelectorAll(".cell").forEach((cell, index) => {
        let column = index % 32
        let row = Math.floor(index/32)
        context.fillStyle = cell.style.backgroundColor || "transparent"
        context.fillRect(column*32, row*32, 32, 32)
    })
    let link = document.createElement('a')
    link.download = "PixelPicture.png"
    link.href = canvas_export.toDataURL()
    link.click()
})