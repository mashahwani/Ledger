function createPagination(elecmentID, totalPages, currentPage) {
  const paginationElement = document.getElementById(elecmentID);

  // Clear existing pagination links
  paginationElement.innerHTML = "";

  // Add Previous link
  const previousLi = document.createElement("li");
  previousLi.classList.add("page-item");
  const previousLink = document.createElement("a");
  previousLink.classList.add("page-link");
  previousLink.href = "#";
  previousLink.textContent = "Previous";
  previousLi.appendChild(previousLink);
  paginationElement.appendChild(previousLi);

  // Add dynamic page links
  for (let i = 1; i <= totalPages; i++) {
    const pageLi = document.createElement("li");
    pageLi.classList.add("page-item");
    const pageLink = document.createElement("a");
    pageLink.classList.add("page-link");
    pageLink.href = "#";
    pageLink.textContent = i;
    if (i === currentPage) {
      pageLi.classList.add("active");
    }
    pageLi.appendChild(pageLink);
    paginationElement.insertBefore(pageLi, paginationElement.lastElementChild); // Insert before the last <li>
  }

  // Add Next link
  const nextLi = document.createElement("li");
  nextLi.classList.add("page-item");
  const nextLink = document.createElement("a");
  nextLink.classList.add("page-link");
  nextLink.href = "#";
  nextLink.textContent = "Next";
  nextLi.appendChild(nextLink);
  paginationElement.appendChild(nextLi);
}

// Creating Pagination
// async function pages() {
//   try {
//     const { data, totalRecords } = await window.api.fetchDataFromMain();
//     createPagination("pagination", Math.ceil(totalRecords / 10), 2);
//   } catch (err) {
//     console.log("Error");
//   }
// }
// ra();
