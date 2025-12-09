//createElemWithText
function createElemWithText(tagName = "p", textContent = "", className) {
  const element = document.createElement(tagName);
  element.textContent = textContent;
  if (className) {
    element.className = className;
  }
  return element;
}
//COMPLETE//

//createSelectOptions
function createSelectOptions(users) {
  if (!users) {
    return;
  }
  const options = [];
  for (const user of users) {
    const option = document.createElement("option");
    option.value = user.id;
    option.textContent = user.name;
    options.push(option);
  }

  return options;
}
//COMPLETE//

//toggleCommentSection
function toggleCommentSection(postId) {
  const section = document.querySelector(`section[data-post-id="${postId}"]`);
  if (!postId) {
    return;
  }
  if (section) {
    section.classList.toggle("hide");
  } else {
    return null;
  }
  return section;
}
//COMPLETE//

//toggleCommentButton
function toggleCommentButton(postId) {
  const button = document.querySelector(`button[data-post-id="${postId}"]`);
  if (!postId) {
    return;
  }
  if (!button) {
    return null;
  }
  if (button.textContent === "Show Comments") {
    button.textContent = "Hide Comments";
  } else {
    button.textContent = "Show Comments";
  }
  return button;
}
//COMPLETE//

//deleteChildElements
function deleteChildElements(parentElement) {
  if (!(parentElement instanceof HTMLElement)) return;
  let child = parentElement.lastElementChild;
  while (child) {
    parentElement.removeChild(child);
    child = parentElement.lastElementChild;
  }
  return parentElement;
}
//COMPLETE//

//addButtonListeners
function addButtonListeners() {
  const main = document.querySelector("main");
  const buttons = main.querySelectorAll("button");
  for (const button of buttons) {
    const postId = button.dataset.postId;
    if (postId) {
      button.addEventListener("click", function (event) {
        toggleComments(event, postId);
      });
    }
  }
  return buttons;
}

//removeButtonListeners
function removeButtonListeners() {
  const main = document.querySelector("main");
  const buttons = main.querySelectorAll("button");
  for (const button of buttons) {
    const postId = button.dataset.postId;
    if (postId) {
      button.removeEventListener("click", function (event) {
        toggleComments(event, postId);
      });
    }
  }
  return buttons;
}
//COMPLETE//

//createComments function
function createComments(comments) {
  if (!comments) return;
  const fragment = document.createDocumentFragment();
  for (const comment of comments) {
    const article = document.createElement("article");
    const h3 = createElemWithText("h3", comment.name);
    const p1 = createElemWithText("p", comment.body);
    const p2 = createElemWithText("p", `From: ${comment.email}`);
    article.append(h3, p1, p2);
    fragment.append(article);
  }
  return fragment;
}
//COMPLETE//

//populateSelectMenu function
function populateSelectMenu(users) {
  if (!users) return;
  const selectMenu = document.getElementById("selectMenu");
  if (!selectMenu) return;
  const options = createSelectOptions(users);
  for (let option of options) {
    selectMenu.append(option);
  }
  return selectMenu;
}
//COMPLETE//

//getUsers function
async function getUsers() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users = await response.json();
    return users;
  } catch (error) {}
}
//COMPLETE//

//getUserPosts function
async function getUserPosts(userId) {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
    );
    const posts = await response.json();
    return posts;
  } catch (error) {}
}
//COMPLETE//

//getUser function
async function getUser(userId) {
  if (!userId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${userId}`
    );
    const user = await response.json();
    return user;
  } catch (error) {}
}
//COMPLETE//

//getPostComments function
async function getPostComments(postId) {
  if (!postId) return;
  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
    );
    const comments = await response.json();
    return comments;
  } catch (error) {}
}
//COMPLETE//

//displayComments function
async function displayComments(postId) {
  if (!postId) return;
  const section = document.createElement("section");
  section.dataset.postId = postId;
  section.classList.add("comments", "hide");
  const comments = await getPostComments(postId);
  const fragment = createComments(comments);
  section.append(fragment);
  return section;
}
//COMPLETE//

//createPosts function
async function createPosts(posts) {
  if (!posts) return;
  const fragment = document.createDocumentFragment();
  for (const post of posts) {
    const article = document.createElement("article");
    const h2 = createElemWithText("h2", post.title);
    const p1 = createElemWithText("p", post.body);
    const p2 = createElemWithText("p", `Post ID: ${post.id}`);
    const author = await getUser(post.userId);
    const p3 = createElemWithText(
      "p",
      `Author: ${author.name} with ${author.company.name}`
    );
    const p4 = createElemWithText("p", `${author.company.catchPhrase}`);
    const button = createElemWithText("button", "Show Comments");
    button.dataset.postId = post.id;
    article.append(h2, p1, p2, p3, p4, button);
    const section = await displayComments(post.id);
    article.append(section);
    fragment.append(article);
  }
  return fragment;
}
//COMPLETE//

//displayPosts function
async function displayPosts(posts) {
  const main = document.querySelector("main");
  let element;
  if (posts) {
    element = await createPosts(posts);
  } else {
    element = createElemWithText(
      "p",
      "Select an Employee to display their posts."
    );
    element.className = "default-text";
  }
  main.append(element);
  return element;
}
//COMPLETE//

//toggleComments function
function toggleComments(event, postId) {
  if (!event || !postId) return;
  event.target.listener = true;
  const section = toggleCommentSection(postId);
  const button = toggleCommentButton(postId);
  return [section, button];
}
//COMPLETE//

//refreshPosts
async function refreshPosts(posts) {
  if (!posts) return;
  const removeButtons = removeButtonListeners();
  const main = deleteChildElements(document.querySelector("main"));
  const fragment = await displayPosts(posts);
  const addButtons = addButtonListeners();
  return [removeButtons, main, fragment, addButtons];
}
//COMPLETE//

//selectMenuChangeEventHandler function
async function selectMenuChangeEventHandler(event) {
  if (!event) return;
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.disabled = true;
  const userId = Number(event?.target?.value || 1);
  const posts = await getUserPosts(userId);
  const refreshPostsArray = await refreshPosts(posts);
  selectMenu.disabled = false;
  return [userId, posts, refreshPostsArray];
}
//COMPLETE//

//initPage function
async function initPage() {
  const users = await getUsers();
  const select = populateSelectMenu(users);
  return [users, select];
}
//COMPLETE//

//initApp function
async function initApp() {
  await initPage();
  const selectMenu = document.getElementById("selectMenu");
  selectMenu.addEventListener("change", selectMenuChangeEventHandler);
}
//COMPLETE//

//extra
document.addEventListener("DOMContentLoaded", initApp);
