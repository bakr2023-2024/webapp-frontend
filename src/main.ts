import "./style.css";
const usersContainer: HTMLElement | null =
  document.getElementById("usersContainer");
const createUserForm: HTMLFormElement | null = document.getElementById(
  "createUserForm"
) as HTMLFormElement;

async function fetchUsers() {
  const res = await fetch("https://webapp-backend-1.onrender.com/users", {
    mode: "cors",
  });
  return await res.json();
}

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
  if (res.ok) {
    renderUsers();
    createUserForm.reset(); // Reset form fields
  } else {
    console.error("Failed to create user");
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
  if (res.ok) {
    renderUsers();
  } else {
    console.error("Failed to delete user");
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
    if (res.ok) {
      renderUsers();
    } else {
      console.error("Failed to update user");
    }
  }
}

if (createUserForm) {
  createUserForm.addEventListener("submit", createUser);
}

(() => {
  renderUsers();
})();
