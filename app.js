
//fetch (url,payload)
const apiUrl = "https://jsonplaceholder.typicode.com/todos";
const todoContainer = document.getElementById("todoContainer");
const todoForm=document.getElementById("todoForm");
const loader = document.getElementById("loader");
const todoInput = document.getElementById("newTodo");
   
 const showLoader = () => {
        loader.style.display = "block";
 };

 const hideLoader = () => {
        loader.style.display="none";
 };

const fetchTodoList = () => {
        showLoader();        //  fetch(apiUrl) // give limite by query param
        fetch(`${apiUrl}?_limit=10`)
        
        //handle promises
        .then((response) => response.json())
        //resolve promises using .then
        .then((todos) => {
        //getting all the todos
        // apped all todo inside todocontainer
        todoContainer.innerHTML="";
        todos.forEach((todo) => displayTodoItems(todo));
        // once api given data then hide the loader
            hideLoader();
        })
        // incase api is not feching data 
        .catch((err) => {
                todoContainer.innerHTML="Error while fetching todos";
                todoContainer.style.color="red";
                hideLoader();
        });

};
// we add in todo by own that will add in the api
todoForm.addEventListener("submit",(e) => {
        e.preventDefault();
        showLoader();
        const todoText = todoInput.value;
        //payload
        const data ={
                title: todoText,
                complete:false,
        };
        //post api
        console.log(JSON.stringyfy(data));
       if(todoText.lenght > 1 ){
        fetch(apiUrl, {
                method:"POST",
                headers: {
                        "Content-Type" : "application/json",
                },
                body:JSON.stringyfy(data),
        }) // promise resolve then response 
        .then((response) => response.json())
        .then((todo) => {
                displayTodoItems(todo);
                todoInput.value = "";
                hideLoader();
        })
        .catch((err) => {
                todoContainer.innerHTML = "Error while adding todos";
                todoContainer.style.color ="red";
                hideLoader();
        });
       }
        console.log(todoText, e.target);
})
       
        
todoInput.addEventListener("change", (e) => console.log(e.target.value));
//edit todos

const editTodoItem = (id, todoText, editBtn) => {
        todoText.disabled=false;
        editBtn.style.display = "none";
        editBtn.nextSibling.style.display = "block";
};

const saveTodoItem = (id, todoText,editBtn, saveBtn) => {
       
        const updatedText = todoText.value.trim();
 //put api
 if(updatedText.length>1) {
        showLoader();
        fetch(`${apiUrl}/${id}`,{
                method:"PUT",
                headers: {
                        "COntent-Type" : "application/json",
                },
                body:JSON.stringify({title:updatedText, complete:false}),
        })
        .then((response) => response.json())
        //resolve promises using .then
        .then((todos) => {
       todoText.disabled=true;
       editBtn.style.display ="block";
       saveBtn.style.display="none";
        // once api given data then hide the loader
            hideLoader();
        })
        // incase api is not feching data 
        .catch((err) => {
                todoContainer.innerHTML="Error while updating todos";
                todoContainer.style.color="red";
                hideLoader();
        });
 }
};

//delete todo
const deleteTodoItem =(id, todoDiv) => {
        showLoader();
        fetch(`${apiUrl}/${id}`,{
                method:"DELETE",
        })
        .then(() => {
                todoDiv.remove();
                hideLoader();
        })
        .catch((err) =>  {
                todoContainer.innerHTML =" Error while deleting todo";
                todoContainer.style.color="red";
                hideLoader();
        });
};
// display all todo
const displayTodoItems = (todo) => {
   
    const todoDiv = document.createElement("div");
    todoDiv.className="todo-item";
    todoDiv.setAttribute("data-id",todo.id);

    //appending an input element, edit , save and delete btn
    const todoText = document.createElement("input");
    todoText.type="text";
    todoText.value = todo.title;
    todoText.disabled = true;

    //edit btn 
    const editBtn = document.createElement("button")
  editBtn.textContent = "Edit";
  editBtn.onclick = () => editTodoItem(todo.id, todoText, editBtn);

   //save btn

   const saveBtn = document.createElement("button")
   saveBtn.textContent="save";
   saveBtn.style.display="none";
   saveBtn.onclick=() => saveTodoItem(todo.id, todoText, editBtn, saveBtn);

   //delete btn
   const deleteBtn = document.createElement("button")
   deleteBtn.textContent="Delete";

   deleteBtn.onclick =() => deleteTodoItem(todo.id,todoDiv);

   todoDiv.appendChild(todoText);
   todoDiv.appendChild(editBtn);
   todoDiv.appendChild(saveBtn);
   todoDiv.appendChild(deleteBtn);
   todoContainer.appendChild(todoDiv);
   

};

window.onload = fetchTodoList;