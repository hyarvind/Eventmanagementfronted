import { jsPDF } from "jspdf";
import "jspdf-autotable";

const downloadButton = document.querySelector(".export-btn");

downloadButton.addEventListener("click", () => {
  const pdf = new jsPDF();
  const table = document.querySelector(".event-history-table");

  pdf.autoTable({
    html: table,
    startY: 10,
    theme: "striped",
    styles: {
      overflow: "linebreak",
      cellWidth: "wrap",
    },
    tableWidth: "auto",
    margin: { left: 10, right: 10 },
    bodyStyles: { fontSize: 8 },
  });

  pdf.save("eventHistoryTable.pdf");
});
