(function ($) {
    // Wrap the AJAX call inside a function
    function fetchData() {
        $.ajax({
            url: '/admin/barchart',
            method: 'POST',
            success: function(response) {
                console.log("response : ",response);
                // Place your code inside the success function
                if ($('#myChart2').length) {
                    var ctx = document.getElementById("myChart2");
                    var myChart = new Chart(ctx, {
                        type: 'pie', // Change to 'pie' for pie chart
                        data: {
                            labels: response.brands, // Labels remain the same for pie chart
                            datasets: [
                                {
                                    label: "Sales by Brands", // You can change the label if needed
                                    backgroundColor: ["#5897fb", "#7bcf86", "#ff9076","#f3c623","#a36cff","#50e3c2","#ff6b6b"], // Colors for different categories
                                    data: response.totalOfferPrices // Sample data for each category
                                }
                            ]
                        },
                        options: {
                            plugins: {
                                legend: {
                                    labels: {
                                        usePointStyle: true,
                                    },
                                }
                            }
                        }
                    });
                }
                
            },
            error: function(xhr, status, error) {
                console.error(error); // Log any errors
            }
        });
    }

    // Call fetchData function when document is ready
    $(document).ready(function() {
        fetchData();
    });

})(jQuery);
