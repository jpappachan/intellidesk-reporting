function drawChart() {
  var data = google.visualization.arrayToDataTable([
    ["Ratings", "Number of Stars"],
    ["Five Star", ratings[5]],
    ["Four Star", ratings[4]],
    ["Three Star", ratings[3]],
    ["Two Star", ratings[2]],
    ["One Star", ratings[1]]
  ]);

  // Optional; add a title and set the width and height of the chart

  // Display the chart inside the <div> element with id="piechart"
  var chart = new google.visualization.PieChart(
    document.getElementById("piechart")
  );
  chart.draw(data, { height: 500, width: "100%" });
}

function drawTable(tableData) {
  var table = new Tabulator("#data-table", {
    height: 700, // set height of table (in CSS or here), this enables the Virtual DOM and improves render speed dramatically (can be any valid css height value)
    data: tableData, //assign data to table
    layout: "fitColumns", //fit columns to width of table (optional)
    columns: [
      //Define Table Columns
      { title: "Rating", field: "rating", width: 100 },
      { title: "Total", field: "totals", width: 100 },
      {
        title: "Links",
        field: "dataArr",
        formatter: function(cell, formatterParams, onRendered) {
          let array = cell.getValue();
          let rating = cell.getRow().getData().rating;
          return array.length > 5
            ? `<a href="#" data-toggle="modal" data-target="#dataModal" data-rating="${rating}">Show All</a>`
            : getLinksHtml(rating, false);
        }
      }
    ]
  });
}

function getLinksHtml(ratingIndex, fromOpenModal) {
  let array = ratingsData[ratingIndex - 1].dataArr;
  let htmlFragment = fromOpenModal
    ? 'class="convLink"'
    : 'data-toggle="modal" data-target="#dataModal"';
  return array.reduce(function(html, element, index) {
    return (
      html +
      `<a href="#" ${htmlFragment} data-rating="${ratingIndex}" data-convindex="${index}">${
        element.id
      }</a><br/>`
    );
  }, "");
}

function printConversation(ratingIndex, conversationIndex) {
  let conversation =
    ratingsData[ratingIndex - 1].dataArr[conversationIndex].summary;
  let output = "";
  conversation.forEach(element => {
    console.log(JSON.stringify(element));
    if (
      element.GoToNextNodeHardcodedInputString ||
      Object.keys(element)[0] == ""
    ) {
      output += `<div class="card bg-light left">${element.GoToNextNodeHardcodedInputString ||
        element[""]}</div>`;
    } else {
      output += `<div class="card bg-light right">${
        Object.keys(element)[0]
      }</div>`;
    }
  });
  return output;
}

function updateModal(modal, modalTitle, modalBody) {
  modal.find(".modal-title").text(modalTitle);
  modal.find(".modal-body").html(modalBody);
}
