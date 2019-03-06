//setup ratings object
let ratings = [0, 0, 0, 0, 0, 0];
let ratingsData = [
  { rating: 0, dataArr: [] },
  { rating: 1, dataArr: [] },
  { rating: 2, dataArr: [] },
  { rating: 3, dataArr: [] },
  { rating: 4, dataArr: [] },
  { rating: 5, dataArr: [] }
];

//Get the Data for processing
$.get(
  "https://store.rapidcommerce.io/gateway/conversationservice/0.0.1/ratingsreport?forClient=uniper",
  function(data) {
    //set up the data for charts and table
    for (let i = 0; i < data.length; i++) {
      ratings[data[i].rating] = ratings[data[i].rating] + 1;
      ratingsData[data[i].rating].dataArr.push({
        id: data[i].id,
        summary: data[i].conversationSynopsis
      });
    }

    ratingsData.forEach(function(element, index) {
      element.totals = ratings[index];
    });
    ratingsData.shift();

    // Load google charts
    google.charts.load("current", {
      packages: ["corechart"]
    });
    google.charts.setOnLoadCallback(drawChart);

    //update the conversation count
    $("#loading").addClass("d-none");
    $("#loading").removeClass("d-md-block");
    $("#totalCount").html(`${data.length} Conversations Analysed`);

    drawTable(ratingsData);
  }
);

//set up modal actions
$("#dataModal").on("show.bs.modal", function(event) {
  let link = $(event.relatedTarget); // Link that triggered the modal
  let rating = link.data("rating"); // Extract info from data-* attributes
  let conversation = link.data("convindex");
  let modalBody =
    conversation || conversation === 0
      ? printConversation(rating, conversation)
      : getLinksHtml(rating, true);
  updateModal($(this), `Rating ${rating}`, modalBody);
});

$(document).on("click", ".convLink", function(event) {
  let link = $(event.target);
  let rating = link.data("rating");
  let conversation = link.data("convindex");
  updateModal(
    $("#dataModal"),
    `Rating ${rating}`,
    printConversation(rating, conversation)
  );
});
