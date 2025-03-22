import { toggleMenu, toggleMobileMenu } from "./utils/toggleMenu.js";
import toggleTheme from "./utils/toggleTheme.js";
import Chart from "chart.js/auto";
import "./utils/downloadTable.js";
import "./utils/newsCarousel.js";
import { eventHistoryTableData } from "./data/eventTableData.json";

const toggleMenuBtn = document.querySelector(".toggle-menu");
const navLinks = document.querySelectorAll(".primary-nav a .nav-link-text");
const toggleThemeBtn = document.querySelector(".toggle-theme");
const userProfileCardInfo = document.querySelector(".user-info");

// toggle menu collapse
toggleMenu(toggleMenuBtn, navLinks, toggleThemeBtn, userProfileCardInfo);

// toggle mobile menu drop down
const mobileMenuBtn = document.querySelector(".mobile-menu");
const navLinksContainer = document.querySelector(".nav-wrapper");

toggleMobileMenu(mobileMenuBtn, navLinksContainer);
//

// toggle theme
toggleTheme(toggleThemeBtn);

// Event registrations per month's bar chart
(function eventBarChart() {
  const ctx = document.getElementById("bar-chart");

  const data = [
    { month: "Jan", count: 770 },
    { month: "Feb", count: 670 },
    { month: "Mar", count: 894 },
    { month: "Apr", count: 499 },
    { month: "May", count: 390 },
    { month: "Jun", count: 859 },
    { month: "Jul", count: 890 },
    { month: "Aug", count: 489 },
    { month: "Sep", count: 799 },
    { month: "Oct", count: 600 },
    { month: "Nov", count: 578 },
    { month: "Dec", count: 990 },
  ];

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: data.map((row) => row.month),
      datasets: [
        {
          data: data.map((row) => row.count),
          borderWidth: 0,
          backgroundColor: "#8576FF",
          borderRadius: 2,
        },
      ],
    },
    options: {
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 200,
          },
          grid: {
            color: "#ADA9BB",
            drawTicks: false,
            drawOnChartArea: true,
          },
          border: {
            display: false,
            dash: [3, 8],
          },
        },
        x: {
          grid: {
            color: "#ADA9BB",
            drawTicks: false,
            drawOnChartArea: true,
          },
          border: {
            display: false,
            dash: [3, 8],
          },
        },
      },
      legend: {
        display: false,
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
})();

// Event history table
const eventHistoryTable = document.querySelector(".event-history-table");
const eventHistoryData = Array.from(eventHistoryTableData);
let currentData = [...eventHistoryData];

const prevBtn = document.querySelector(".event-h-t-prev-btn");
const nextBtn = document.querySelector(".event-h-t-next-btn");
const pageButtonsContainer = document.querySelector(
  ".table-page-number-container",
);
const selectNumberOfRowsPerPage = document.querySelector(".row-count");

let currentPage = 1;
let numberOfRowsPerPage = parseInt(selectNumberOfRowsPerPage.value.trim(), 10);
let totalPages = Math.ceil(eventHistoryData.length / numberOfRowsPerPage);

const displayTotalNumberOfResults =
  document.querySelector(".number-of-results");

function buildTableRows(
  tableData = currentData,
  rowsPerPage = numberOfRowsPerPage,
) {
  const tbody = eventHistoryTable.querySelector("tbody");
  tbody.innerHTML = "";

  // Calculate the range of rows for the current page
  const start = (currentPage - 1) * rowsPerPage;
  const end = start + rowsPerPage;
  const pageData = tableData.slice(start, end);

  // Populate rows with the data for the current page
  pageData.forEach((data) => {
    tbody.innerHTML += `
      <tr 
         popovertarget="event-detail-popover"
         popovertargetaction="toggle"
      >
         <td aria-label="event name">
           <button class="td-arrow-button" aria-label="Expand details" aria-expanded="false">
             <svg width="5" height="8" viewBox="0 0 5 8" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M0.75 0.75L4.25 4L0.75 7.25" stroke="#FCF7FF" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
             </svg>
           </button>
           <span>${data["event name"]}</span>
         </td>
         <td aria-label="event date">${data.date}</td>
         <td aria-label="event speaker">${data.speaker}</td>
         <td aria-label="event status" class=${data.status === "Completed" ? "completed" : "in-progress"}>${data.status}</td>
      </tr>
    `;
  });

  attachRowClickEvents(); // for popover

  totalPages = Math.ceil(tableData.length / rowsPerPage);
  updatePageButtons();
  updateNavigationButtons();

  displayTotalNumberOfResults.innerText = `Displaying ${tableData.length} results`;
}

function updatePageButtons() {
  pageButtonsContainer.innerHTML = "";

  // Create page buttons
  for (let i = 1; i <= totalPages; i++) {
    const pageBtn = document.createElement("button");
    pageBtn.classList.add("table-page");
    pageBtn.setAttribute("aria-label", `page number ${i}`);
    pageBtn.setAttribute("aria-current", i === currentPage ? "true" : "false");
    pageBtn.textContent = i;

    pageBtn.addEventListener("click", () => {
      currentPage = i;
      buildTableRows(eventHistoryData, numberOfRowsPerPage);
    });

    pageButtonsContainer.appendChild(pageBtn);
  }
}

function updateNavigationButtons() {
  prevBtn.disabled = currentPage === 1;
  nextBtn.disabled = currentPage === totalPages;

  // Scroll the current page button into view on navigation
  const currentPageButton = pageButtonsContainer.querySelector(
    `[aria-current="true"]`,
  );
  if (currentPageButton) {
    currentPageButton.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }
}

// Event listeners for navigation
prevBtn.addEventListener("click", () => {
  if (currentPage > 1) {
    currentPage--;
    buildTableRows(currentData, numberOfRowsPerPage);
  }
});

nextBtn.addEventListener("click", () => {
  if (currentPage < totalPages) {
    currentPage++;
    buildTableRows(currentData, numberOfRowsPerPage);
  }
});

// Event listener for rows per page selection
selectNumberOfRowsPerPage.addEventListener("change", () => {
  numberOfRowsPerPage = parseInt(selectNumberOfRowsPerPage.value.trim(), 10);
  currentPage = 1;
  buildTableRows(currentData, numberOfRowsPerPage);
});

// Initialize table
buildTableRows(currentData, numberOfRowsPerPage);
//

// Search by text input
const searchInput = document.getElementById("search-event");

searchInput.addEventListener("keyup", () => {
  const filter = searchInput.value.trim().toLowerCase();
  currentData =
    filter === ""
      ? [...eventHistoryData]
      : eventHistoryData.filter((data) =>
          Object.values(data).some((value) =>
            value.toString().toLowerCase().includes(filter),
          ),
        );

  currentPage = 1;
  buildTableRows(currentData, numberOfRowsPerPage);
  toggleNoResultsMessage();
});
//

// Search by date input
const dateInput = document.getElementById("select-date");

dateInput.addEventListener("change", () => {
  const filter = dateInput.value;
  const filteredData = eventHistoryData.filter((data) => data.date === filter);

  currentPage = 1;

  if (filter === "") {
    currentData = eventHistoryTableData;
    buildTableRows(currentData, numberOfRowsPerPage);
  } else {
    currentData = filteredData;
    buildTableRows(filteredData, numberOfRowsPerPage);
  }

  toggleNoResultsMessage();

  displayTotalNumberOfResults.innerText = `Displaying ${filteredData.length} results`;
});
//

// Filter by status
const selectStatus = document.getElementById("select-status");

selectStatus.addEventListener("change", () => {
  const filter = selectStatus.value.trim();
  const filteredData =
    filter === ""
      ? eventHistoryData
      : eventHistoryData.filter((data) => data.status === filter);

  currentPage = 1;
  currentData = filteredData;
  buildTableRows(currentData, numberOfRowsPerPage);
  toggleNoResultsMessage();

  displayTotalNumberOfResults.innerText = `Displaying ${filteredData.length} results`;
});

// Sort table by date (most recent, ...)
const sortOptions = document.getElementById("sort-events");

// Sort options event listener
sortOptions.addEventListener("change", () => {
  const filter = sortOptions.value.trim();
  let sortedData;

  if (filter === "most recent") {
    sortedData = [...eventHistoryData].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
  } else if (filter === "oldest first") {
    sortedData = [...eventHistoryData].sort(
      (a, b) => new Date(a.date) - new Date(b.date),
    );
  } else {
    sortedData = [...eventHistoryData];
  }

  currentPage = 1;
  currentData = sortedData;
  buildTableRows(currentData, numberOfRowsPerPage);
  toggleNoResultsMessage();

  displayTotalNumberOfResults.innerText = `Displaying ${sortedData.length} results`;
});
//

// Helper function to toggle no-results message
function toggleNoResultsMessage() {
  const noResultsMessage = document.querySelector(".noResults");
  noResultsMessage.style.display = currentData.length === 0 ? "block" : "none";
}

// Event detail popover
const popoverInfoCard = document.getElementById("event-detail-popover");
const closePopoverBtn = document.querySelector(".po-close-btn");

const togglePopover = () => {
  if (popoverInfoCard.style.display === "grid") {
    popoverInfoCard.style.display = "none";
  } else {
    popoverInfoCard.style.display = "grid";
  }
};

closePopoverBtn.addEventListener("click", togglePopover);

function attachRowClickEvents() {
  const rows = eventHistoryTable.getElementsByTagName("tr");

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];

    row.addEventListener("click", () => {
      const eventName = row.getElementsByTagName("td")[0];
      const eventDate = row.getElementsByTagName("td")[1];

      popoverInfoCard.querySelector(".po-event-name").innerText =
        eventName.innerText;
      popoverInfoCard.querySelector(".po-event-date").innerText =
        eventDate.innerText;

      togglePopover();
    });
  }
}
//
