document.addEventListener("DOMContentLoaded", function() {
    // Function to fetch and display movie details
    function fetchMovieDetails(filmId) {
        fetch(`http://localhost:3000/films/${filmId}`)
            .then(res => res.json())
            .then(data => {
                // Populate movie details on the page
                document.getElementById('title').innerText = data.title;
                document.getElementById('runtime').innerText = `${data.runtime} minutes`;
                document.getElementById('showtime').innerText = data.showtime;
                document.getElementById('poster').src = data.poster;
                document.getElementById('film-info').innerText = data.description;

                const availableTickets = data.capacity - data.tickets_sold;
                document.getElementById('ticket-num').innerText = availableTickets;

                // If statement that checks if the variable `availableTickets` is equal to 0
                // If it is, it updates the text content of an element with id "buy-ticket" to "Sold Out" and disables the button
                if (availableTickets === 0) {
                    document.getElementById('buy-ticket').innerText = 'Sold Out';
                    document.getElementById('buy-ticket').disabled = true;
                } else {
                    document.getElementById('buy-ticket').innerText = 'Buy Ticket';
                    document.getElementById('buy-ticket').disabled = false;
                }
            })
            .catch(err => console.error('Error fetching movie details:', err));
    }
    
    // Function to fetch and display movie menu
    function fetchMovieMenu() {
        fetch('http://localhost:3000/films')
            .then(res => res.json())
            .then(data => {
                const filmsList = document.getElementById('films');
                filmsList.innerHTML = ''; // Clear existing list

                // Create and populate <li> elements for each movie
                data.forEach((movie) => {
                    const li = document.createElement("li");
                    li.textContent = movie.title;

                    // Add a click event listener to the <li> element
                    li.addEventListener("click", () => {
                        fetchMovieDetails(movie.id);
                    });

                    // Append the <li> element to the filmsList
                    filmsList.appendChild(li);
                });
            })
            .catch(err => console.error('Error fetching movie menu:', err));
    }

    // Event listener for buy Ticket button
    document.getElementById('buy-ticket').addEventListener('click', function() {
        // Implement ticket purchasing logic here
        const filmId = 1; // Replace with the actual film ID
        fetch(`http://localhost:3000/films/${filmId}`)
            .then(res => res.json())
            .then(data => {
                if (data.tickets_sold < data.capacity) {
                    // Update frontend: decrease available ticket count by 1
                    const availableTicketsElem = document.getElementById('ticket-num');
                    let availableTickets = parseInt(availableTicketsElem.innerText);
                    availableTickets -= 1;
                    availableTicketsElem.innerText = availableTickets;

                    // Make PATCH request to update tickets_sold in the backend
                    fetch(`http://localhost:3000/films/${filmId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ tickets_sold: data.tickets_sold + 1 })
                    })
                    .then(() => { 
                        // Handle successful ticket purchase
                        console.log('Ticket purchased successfully');
                    })
                    .catch(error => {
                        console.error('Error purchasing ticket:', error);
                        // Handle error in ticket purchase
                    });
                } else {
                    // Handle case where tickets are sold out
                    console.log('Tickets are sold out');
                }
            })
            .catch(error => {
                console.error('Error fetching film details:', error);
                // Handle error in fetching film details
            });
    });

    // Event listener for Delete film button 
    document.getElementById('films').addEventListener('click', function(event) {
        if (event.target.tagName === 'LI') {
            const filmTitle = event.target.innerText;

            // Implement film deletion logic here

            // Make a DELETE request to delete the film title or ID
            fetch(`http://localhost:3000/films`, {
                method: 'DELETE',
                body: JSON.stringify({ title: filmTitle }), // Send the film title or ID for deletion
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(res => {
                // Handle the response if needed
                console.log('Film deleted successfully');
            })
            .catch(error => {
                console.error('Error deleting film:', error);
            });
        }
    });

    // Initial setup when the page loads
    fetchMovieDetails(1); // Fetch details for the first movie initially
    fetchMovieMenu();
});

