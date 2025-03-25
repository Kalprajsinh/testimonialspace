document.addEventListener("DOMContentLoaded", async function () {
  const testimonialContainer = document.getElementById("testimonial");
  const admin = testimonialContainer.getAttribute("admin");
  const organizationName = testimonialContainer.getAttribute("organizationName");

  // Create the basic structure for the slider and buttons
  testimonialContainer.innerHTML = `
    <div class="testimonial-slider relative max-w-4xl mx-auto mt-8">
      <div id="testimonial-container" class="testimonial-container relative overflow-hidden">
        <!-- Testimonials will be injected here -->
      </div>
      <button id="prev" class="prev-btn absolute top-1/2 left-4 transform -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full focus:outline-none">
        Prev
      </button>
      <button id="next" class="next-btn absolute top-1/2 right-4 transform -translate-y-1/2 bg-indigo-500 text-white p-3 rounded-full focus:outline-none">
        Next
      </button>
    </div>
  `;

  // Fetch testimonials from the API
  try {
    const response = await fetch(`http://localhost:3001/api/alluser?admin=${encodeURIComponent(admin)}&organizationName=${encodeURIComponent(organizationName)}`);
    const testimonials = await response.json();

    if (!testimonials.length) {
      document.getElementById("testimonial-container").innerHTML = "<p>No testimonials found.</p>";
      return;
    }

    // Populate the slider with testimonials
    const testimonialItems = testimonials.map((testimonial) => `
    
      <div class="testimonial-item bg-white rounded-lg shadow-lg p-6 mb-4">
        <div class="flex items-center mb-4">
          <img class="w-12 h-12 rounded-full border-2 border-indigo-500" src="${testimonial.photo}" alt="User Image">
          <div class="ml-4">
            <h2 class="text-lg font-semibold text-gray-800">${testimonial.name}</h2>
            <p class="text-sm text-gray-500">${testimonial.email}</p>
          </div>
        </div>
        <div>
        <div class="flex items-center">
          ${`<svg class="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15l-3.5 2 1-4.5-3.5-3h4.5L10 5l1.5 4.5h4.5l-3.5 3 1 4.5z"/>
          </svg>`.repeat(testimonial.star)}
          ${`<svg class="w-5 h-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M10 15l-3.5 2 1-4.5-3.5-3h4.5L10 5l1.5 4.5h4.5l-3.5 3 1 4.5z"/>
          </svg>`.repeat(5 - testimonial.star)}
        </div>
        <p class="text-gray-700 text-base mb-4">${testimonial.text}</p>
        </div>
        </div>
        
    `).join("");

    document.getElementById("testimonial-container").innerHTML = testimonialItems;

    // Initialize slider functionality
    let currentIndex = 0;
    const testimonialElements = document.querySelectorAll('.testimonial-item');
    const totalTestimonials = testimonialElements.length;

    // Function to update the slider view
    function updateSlider() {
      testimonialElements.forEach((item, index) => {
        if (index === currentIndex) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    }

    // Initialize the first view
    updateSlider();

    // Event listeners for Previous and Next buttons
    document.getElementById('prev').addEventListener('click', function () {
      currentIndex = (currentIndex - 1 + totalTestimonials) % totalTestimonials;
      updateSlider();
    });

    document.getElementById('next').addEventListener('click', function () {
      currentIndex = (currentIndex + 1) % totalTestimonials;
      updateSlider();
    });

  } catch (error) {
    console.error("Error fetching testimonials:", error);
    document.getElementById("testimonial-container").innerHTML = "<p>Failed to load testimonials.</p>";
  }
});



  // <div id="testimonial" organization="codepoint"></div>
  // <script src="https://mywebsite/script.js"></script>
  // <script src="https://cdn.tailwindcss.com"></script>

// https://dribbble.com/shots/5256055-Testimonials