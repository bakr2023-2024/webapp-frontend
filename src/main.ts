import "./style.css";
const usersContainer: HTMLElement | null =
  document.getElementById("usersContainer");
const createUserForm: HTMLFormElement | null = document.getElementById(
  "createUserForm"
) as HTMLFormElement;
const fetchUsersBtn: HTMLElement | null =
  document.getElementById("fetchUsersBtn");
const resultMsg: HTMLElement | null = document.getElementById("result-msg");
async function fetchUsers() {
  const res = await fetch("https://webapp-backend-1.onrender.com/users", {
    mode: "cors",
  });
  return await res.json();
}
const displayResult = (operation: string, result: any) => {
  if (resultMsg) resultMsg.textContent = operation + ": " + result;
};
async function renderUsers() {
  const users: any[] = await fetchUsers();
  if (usersContainer) {
    usersContainer.innerHTML = "";
    users.forEach((user) => {
      const userDiv = document.createElement("div");
      userDiv.setAttribute("data-id", user.id);
      const nameParagraph = document.createElement("p");
      nameParagraph.textContent = `Name: ${user.name}`;
      userDiv.appendChild(nameParagraph);
      const jobParagraph = document.createElement("p");
      jobParagraph.textContent = `Job: ${user.job}`;
      userDiv.appendChild(jobParagraph);
      const deleteButton = document.createElement("button");
      deleteButton.textContent = "Delete";
      deleteButton.addEventListener("click", () => deleteUser(user.id));
      userDiv.appendChild(deleteButton);
      const updateButton = document.createElement("button");
      updateButton.textContent = "Update";
      updateButton.addEventListener("click", () =>
        updateUser(user.id, user.name, user.job)
      );
      userDiv.appendChild(updateButton);
      usersContainer.appendChild(userDiv);
    });
  }
}

async function createUser(event: Event) {
  event.preventDefault();
  if (!createUserForm) return;
  const formData = new FormData(createUserForm);
  const res = await fetch("https://webapp-backend-1.onrender.com/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(Object.fromEntries(formData)),
    mode: "cors",
  });
  const result = await res.json();
  if (result) {
    renderUsers();
    displayResult("Create", JSON.stringify(result));
    createUserForm.reset(); // Reset form fields
  } else {
    displayResult("Error", "Failed to create user");
  }
}

async function deleteUser(userId: number) {
  const res = await fetch(
    `https://webapp-backend-1.onrender.com/users/${userId}`,
    {
      method: "DELETE",
      mode: "cors",
    }
  );
  const result = await res.json();
  if (result) {
    renderUsers();
    displayResult("Delete", JSON.stringify(result));
  } else {
    displayResult("Error", "Failed to delete user");
  }
}

async function updateUser(userId: number, name: string, job: string) {
  const newName = prompt("Enter new name:", name);
  const newJob = prompt("Enter new job:", job);
  if (newName !== null && newJob !== null) {
    const res = await fetch(
      `https://webapp-backend-1.onrender.com/users/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newName,
          job: newJob,
        }),
        mode: "cors",
      }
    );
    const result = await res.json();
    if (result) {
      renderUsers();
      displayResult("Update", JSON.stringify(result));
    } else {
      displayResult("Error", "Failed to update user");
    }
  }
}

if (createUserForm && fetchUsersBtn) {
  createUserForm.addEventListener("submit", createUser);
  fetchUsersBtn.addEventListener("click", () => {
    usersContainer?.classList.toggle("hide");
  });
}
(async function () {
  await renderUsers();
})();
