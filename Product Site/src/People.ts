//User type definitions based on API response structure:
type Geo = {
  lat: string;
  lng: string;
};

type Address = {
  street: string;
  suite: string;
  city: string;
  zipcode: string;
  geo: Geo;
};

type Company = {
  name: string;
  catchPhrase: string;
  bs: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
};

//Fetch user data from API
async function getUserInfo(): Promise<User[]> {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const users: User[] = await response.json();
    console.log({ users });
    return users;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return [];
  }
}

//Display user data in the gallery
const showUsers = (users: User[]) => {
  users.map((user) => {
    const galleryItem = document.querySelector(".gallery");
    const divider = document.createElement("div");
    divider.className = "divider";

    // Create the card
    const card = document.createElement("div");
    card.className = "gallery-item";

    // name block
    const nameElement = document.createElement("h2");
    nameElement.className = "name";
    nameElement.textContent = user.name;

    // username details
    const usernameElement = document.createElement("p");
    usernameElement.className = "subtitle";
    usernameElement.textContent = `@${user.username}`;

    // contact info
    const contactSection = document.createElement("a");
    contactSection.className = "details-section";
    contactSection.textContent = `${user.email} • ${user.phone} • ${user.website}`;

    // company details
    const companySection = document.createElement("div");
    companySection.className = "details-section";
    companySection.textContent = `${user.company.name} — "${user.company.catchPhrase}"`;

    // address info
    const addressSection = document.createElement("div");
    addressSection.className = "details-section";
    addressSection.textContent = `${user.address.street}, ${user.address.suite}, ${user.address.city}, ${user.address.zipcode}`;

    card.append(
      nameElement,
      usernameElement,
      contactSection,
      companySection,
      addressSection,
    );

    galleryItem?.append(card, divider);
  });
};

const searchInput = document.getElementById(
  "people-search",
) as HTMLInputElement | null;

const searchForAPerson = (users: User[], query: string) => {
  return users.filter((user) =>
    user.name.toLowerCase().includes(query.toLowerCase()),
  );
};

async function searchResult() {
  const users = await getUserInfo();
  showUsers(users);

  searchInput?.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value;
    const filteredUsers = searchForAPerson(users, query);
    const gallery = document.querySelector(".gallery");
    if (gallery) {
      gallery.innerHTML = "";
      showUsers(filteredUsers);
    }
  });
}

searchResult();

// Alternative approach with .then():
// getUserInfo().then((users) => {
//   // const users = data?.users || [];
//   showUsers(users);
//   searchInput?.addEventListener("input", (e) => {
//     const query = (e.target as HTMLInputElement).value;
//     const filteredUsers = searchForAPerson(users, query);
//     const gallery = document.querySelector(".gallery");
//     if (gallery) {
//       gallery.innerHTML = "";
//       showUsers(filteredUsers);
//     }
//   });
// });

//showUsers();

// const searchForAPerson = (name: User[], query: string) => {
//   return name.filter((user) =>
//     user.name.toLowerCase().includes(query.toLowerCase())
//   );
// };

//Older version with insertAdjacentHTML:
// async function getUserInfo() {
// try {
// const res = await fetch("https://jsonplaceholder.typicode.com/users");
// const users: User[] = await res.json();
// console.log({ users });
// users.map((user) => {
// const galleryItem = document.querySelector(".gallery-item");
// galleryItem?.insertAdjacentHTML(
// "beforeend",
// `<li>
// <strong>${user.name}</strong> (@${user.username})<br>
// Email: ${user.email}<br>
// Phone: ${user.phone}<br>
// Website: ${user.website}<br>
// <strong>Company:</strong> ${user.company.name}<br>
// &nbsp;&nbsp;Catchphrase: ${user.company.catchPhrase}<br>
// &nbsp;&nbsp;BS: ${user.company.bs}<br>
// <strong>Address:</strong> ${user.address.street}, ${user.address.suite}<br>
// &nbsp;&nbsp;${user.address.city}, ${user.address.zipcode}<br>
// </li>`
// );
// });
// } catch (error) {
// console.error("Error fetching user data:", error);
// }
// }

// showUsers(await getUserInfo().then((data) => data?.users || []));

// const peopleGallery = () => {
//   return fetch("https://randomuser.me/api/?results=10")
//     .then((res) => res.json())
//     .then((data) => {
//       const people = data.results;
//       people.forEach((person: any) => {
//         console.log(
//           `${person.name.first} ${person.name.last} - ${person.email}`
//         );
//       });
//     })
//     .catch((error) => {
//       console.error("Error fetching people data:", error);
//     });
// };
