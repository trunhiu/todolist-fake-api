// Chức năng 1: Thêm công việc

// Chức năng 4: Xoá công việc

// Chức năng 5: Thay đổi trạng thái công việc

// Thuộc tính trong ứng dụng

// Id, Title, Status :

let todos;


//Truy cập

const todoListEl = document.querySelector('.todo-list');
const todoOptionEles = document.querySelectorAll('.todo-option-item input');
const todoInputEl = document.getElementById('todo-input');
const btnAdd = document.getElementById('btn-add');
const btnChange = document.getElementById('btn-update');
const btnUpdate = document.querySelector('.btn-update');

let isUpdate = false;
let idUpdate = null;

// API lấy danh sách công việc
let getTodos = async () => {
    try {
        let res = await axios.get("/todos")
        todos = res.data;
        renderTodo(todos);
    } catch (error) {
        console.log(error);
    }
}
const renderTodo = arr => {
    todoListEl.innerHTML = '';

    // Kiểm tra danh sách công việc có trống hay không?
    if (arr.length == 0) {
        todoListEl.innerHTML = `<p class="todos-empty">Không có công việc nào trong danh sách</p>`;
        return;
    }

    // Hiển thị danh sách
    let html = '';
    arr.forEach(t => {
        html += `
        <div class="todo-item ${t.status ? 'active-todo' : ''}">
                    <div class="todo-item-title">
                        <input type="checkbox" ${t.status ? 'checked' : ''} onclick="toggleStatus(${t.id})"/>
                        <p>${t.title}</p>
                    </div>
                    <div class="option">
                        <button class="btn btn-update" onclick="changeTodo(${t.id})">
                            <img src="./img/pencil.svg" alt="icon" />
                        </button>
                        <button class="btn btn-delete" onclick="deleteTodo(${t.id})">
                            <img src="./img/remove.svg" alt="icon" />
                        </button>
                    </div>
                </div>
        `
    })

    todoListEl.innerHTML = html;
}

// // Thay đổi công việc

// const changeTodo = (id) => {
//     let title
//     todos.find(ele => {
//         if (ele.id == id) {
//             title = ele.title;
//         }
//     })

//     btnChange.style.display = 'inline-block';
//     btnAdd.style.display = 'none';
//     todoInputEl.value = title;
//     todoInputEl.focus();

//     isUpdate = true;
//     idUpdate = id;
// }

// btnChange.addEventListener('click', function(){
//     addTodo();
// })

// Xoá công việc

const deleteTodo = async (id) => {
    try {
        // gọi API --> Xoá trên sever
        await axios.delete(`/todos/${id}`);

        // Lọc ra các công việc khác id của công việc muốn xoá
        todos = todos.filter(todo => todo.id != id);

        // Hiển thị lại trên giao diện
        renderTodo(todos);
    } catch (error) {
        console.log(error); 
    }
}

// Thay đổi trạng thái công việc

const toggleStatus = async (id) => {
    try {
       //Lấy ra công việc cần thay đổi
    let todo = todos.find(todo => todo.id == id);

    //Thay đổi trạng thái công việc đó: true -> false, false -> true
    todo.status = !todo.status;

    // Gọi API 
    await axios.put(`/todos/${id}`, todo)

    //Hiển thị lên trên giao diện
    renderTodo(todos); 
    } catch (error) {
        console.log(error);
    }   
}


// Thêm công việc
btnAdd.addEventListener('click', function () {
    addTodo();
})

const addTodo = async () => {
    try {
        //Lấy ra dữ liệu trong ô input
    let title = todoInputEl.value;

    //Kiểm tra tiêu đề không được để trống
    if (!title) {
        alert('Tiêu đề công việc không được để trống');
        return;
    }
    if (isUpdate) {
        todos.find(ele => {
            if(ele.id === idUpdate) {
                ele.title = title;
            }
        })
        
        btnAdd.style.display = 'inline-block';
        btnChange.style.display = 'none';
        
        isUpdate = false;
        idUpdate = null;

    }else {
        //Tạo công việc mới
        let newTodo = {
            title: title,
            status: false
        }

        // Gọi API tạo mới
        let res = await axios.post("/todos", newTodo);

        // Thêm công việc mới vào mảng để quản lý
        todos.push(res.data);
    }

    renderTodo(todos);

    todoInputEl.value = '';
    } catch (error) {
        console.log(error);
    }
    
}

todoInputEl.addEventListener('keydown', (event) => {
    if (event.keyCode === 13) {
        addTodo();
    }
})

getTodos();
