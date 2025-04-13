document.addEventListener('DOMContentLoaded', function() {
    // Fetch products from API
    fetch('http://localhost:3000/products')
        .then(response => response.json()) // Parse the JSON response
        .then(data => {
            displayProducts(data.data);
        })
        .catch(error => {
            console.error('Error fetching products:', error);
        });
    
    // Function to dynamically display the fetched products
    function displayProducts(products) {
        const productListContainer = document.getElementById('product-list');
        productListContainer.innerHTML = ''; // Clear previous content (in case of reloading)

        products.forEach(product => {
            // Create a product card
            const productCard = document.createElement('div');
            productCard.classList.add('product-card');
            productCard.setAttribute('data-name', product.name); // Store product name for filtering

            // Populate product card with data
            productCard.innerHTML = `
                <img src="${product.imageUrl}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
                <button>Add to Cart</button>
            `;

            // Append the product card to the product list container
            productListContainer.appendChild(productCard);
        });
    }
});

let filteredProducts = [];

// Function to filter products based on search input
function searchProducts() {
    const searchInput = document.getElementById("search-input").value;
    const dropdown = document.getElementById("search-dropdown");
    const dropdownList = document.getElementById("dropdown-list");

    // Clear the current dropdown list
    dropdownList.innerHTML = "";

    // If input is empty, hide the dropdown
    if (!searchInput) {
        dropdown.style.display = "none";
        return;
    }
    const forbiddenChars = /[\/\\|@=<>]/;
    if (forbiddenChars.test(searchInput)) {
        // If forbidden characters are found, show an error and return early
        dropdown.style.display = "none";
        alert("Search input contains invalid characters (/, \\, |, @, =, <, >). Please remove them and try again.");
        return;
    }

    fetch('http://localhost:3000/products/search',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: searchInput }), // Send the search input to the server
    })
        .then(response => response.json())
        .then(data => {
            filteredProducts = data.data;

            // If there are no results, hide the dropdown
            if (filteredProducts.length === 0) {
                dropdown.style.display = "block";
                const noResultsItem = document.createElement("li");
                noResultsItem.textContent = "No products found";
                noResultsItem.style.fontStyle = "italic";
                noResultsItem.style.color = "#888";
                dropdownList.appendChild(noResultsItem);
            }else{
                // Show the dropdown and populate it with filtered products
                dropdown.style.display = "block";

                const productsToDisplay = filteredProducts.slice(0, 5);

                productsToDisplay.forEach(product => {
                    const listItem = document.createElement("li");
                    listItem.textContent = product.name;
                    listItem.addEventListener("click", () => {
                        // When a product is clicked, set the search input and hide the dropdown
                        document.getElementById("search-input").value = product.name;
                        dropdown.style.display = "none";  // Hide dropdown after selection
                    });
                    dropdownList.appendChild(listItem);
                });

                // Show the "X more products" message if there are more than 5 results
                if (filteredProducts.length > 5) {
                    const moreProductsItem = document.createElement("li");
                    const remainingProducts = filteredProducts.length - 5;
                    moreProductsItem.textContent = `${remainingProducts} more products`;
                    moreProductsItem.style.fontStyle = "italic";
                    moreProductsItem.style.color = "#00796b"; // Optional: Highlight the text color
                    dropdownList.appendChild(moreProductsItem);
                }
            }
        })
        .catch(error => {
            console.error('Error searching products:', error);
        });

}
