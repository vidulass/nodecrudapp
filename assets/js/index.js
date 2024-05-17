$(document).ready(function() {

    // Event handler for the add user form submission
    $("#add_user").submit(function(event){
        // Show an alert message when the user is successfully added
        alert("Data Inserted Successfully!");
        
        // Here you can add any additional logic or redirection if necessary
        // window.location.href = '/'; // Uncomment this line to redirect to the index page
    });

    // Event handler for the update user form submission
    $("#update_user").submit(function(event){
        // Prevent the default form submission behavior
        event.preventDefault();

        // Serialize form data into an array of key-value pairs
        var unindexed_array = $(this).serializeArray();
        var data = {};

        // Map the array to an object with key-value pairs
        $.map(unindexed_array, function(n, i){
            data[n['name']] = n['value'];
        });

        console.log(data); // Log the data to the console for debugging

        // AJAX request configuration for updating user data
        var request = {
            "url": `http://localhost:3000/api/users/${data.id}`,
            "method": "PUT",
            "data": data
        };

        // Send the AJAX request to update the user data
        $.ajax(request).done(function(response){
            // Show an alert message when the user data is successfully updated
            alert("Data Updated Successfully");
        });
    });

    // Event handler for the delete button on the index page
    if (window.location.pathname == "/") {
        $ondelete = $(".table tbody td a.delete");
        $ondelete.click(function() {
            var id = $(this).attr("data-id"); // Get the user ID from the data-id attribute

            // AJAX request configuration for deleting user data
            var request = {
                "url": `http://localhost:3000/api/users/${id}`,
                "method": "DELETE"
            };

            // Confirm deletion with the user before sending the request
            if (confirm("Do you really want to delete this record?")) {
                $.ajax(request).done(function(response){
                    // Show an alert message when the user data is successfully deleted
                    alert("Data Deleted Successfully!");
                    location.reload(); // Reload the page to reflect changes
                });
            }
        });
    }

    // Event handler for the search form submission
    $('#searchForm').on('submit', function(event) {
        // Prevent the default form submission behavior
        event.preventDefault();

        const userName = $('#userName').val(); // Get the search term from the input field

        // Fetch users matching the search term
        fetch(`/api/users/${userName}`)
            .then(response => response.json())
            .then(data => {
                const userTableBody = $('#userTableBody');
                userTableBody.empty(); // Clear the table body before appending new rows

                if (data.message) {
                    // If there is a message (no users found), display it in the table
                    userTableBody.append(`<tr><td colspan="6">${data.message}</td></tr>`);
                } else {
                    // If users are found, append each user as a new row in the table
                    data.forEach((user, index) => {
                        userTableBody.append(`
                            <tr>
                                <td>${index + 1}</td>
                                <td>${user.name}</td>
                                <td>${user.email}</td>
                                <td>${user.gender}</td>
                                <td>${user.status}</td>
                                <td>
                                    <a href="/update-user?id=${user._id}" class="btn border-shadow update">
                                        <span class="text-gradient"><i class="fas fa-pencil-alt"></i></span>
                                    </a>
                                    <a class="btn border-shadow delete" data-id="${user._id}">
                                        <span class="text-gradient"><i class="fas fa-times"></i></span>
                                    </a>
                                </td>
                            </tr>
                        `);
                    });

                    // Re-bind delete buttons to the new rows
                    $ondelete = $(".table tbody td a.delete");
                    $ondelete.click(function() {
                        var id = $(this).attr("data-id");

                        var request = {
                            "url": `http://localhost:3000/api/users/${id}`,
                            "method": "DELETE"
                        };

                        if (confirm("Do you really want to delete this record?")) {
                            $.ajax(request).done(function(response){
                                alert("Data Deleted Successfully!");
                                location.reload();
                            });
                        }
                    });
                }
            })
            .catch(err => {
                console.error('Error fetching users:', err);
                const userTableBody = $('#userTableBody');
                userTableBody.empty(); // Clear the table body in case of an error
                userTableBody.append('<tr><td colspan="6">Error fetching users.</td></tr>');
            });
    });
});
