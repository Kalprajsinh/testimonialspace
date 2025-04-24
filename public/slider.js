document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("testimonial");
    const admin = container.getAttribute("admin");
    const orgName = container.getAttribute("organization");
    const theme = container.getAttribute("theme");
  
    // Determine theme colors
    const isDark = theme === "dark";
    const bgColor = isDark ? "bg-black" : "bg-transparent";
    const textColor = isDark ? "text-white" : "text-gray-900";
    const secondaryText = isDark ? "text-gray-300" : "text-gray-600";
    const cardBg = isDark ? "bg-zinc-900" : "bg-white";
    const borderColor = isDark ? "border-gray-700" : "border-gray-200";
    const buttonBg = isDark ? "bg-zinc-800 hover:bg-zinc-700" : "bg-white hover:bg-gray-50";
  
    container.innerHTML = `
      <div class="${bgColor} ${textColor} py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
        <div class="max-w-7xl mx-auto relative">
          <div class="absolute z-10 bottom-5 right-0 text-sm text-gray-400 opacity-50">Powered by <a href="http://localhost:3000">TestimonialSpace</a></div>
          <div class="text-center mb-12">
            
            <h1 class="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">What our customers say</h1>
            <p class="mt-3 max-w-2xl mx-auto text-lg ${secondaryText}">Don't just take our word for it - hear from some of our amazing users</p>
          </div>
          
          <div class="relative">
            <div id="testimonials-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"></div>
            
            <!-- Navigation buttons -->
            <div class="flex justify-center mt-10 space-x-4">
              <button id="scroll-left" class="${buttonBg} w-12 h-12 rounded-full shadow-md flex items-center justify-center border ${borderColor} transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${textColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button id="scroll-right" class="${buttonBg} w-12 h-12 rounded-full shadow-md flex items-center justify-center border ${borderColor} transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ${textColor}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  
    try {
      const res = await fetch(`http://localhost:3001/api/favorite?admin=${encodeURIComponent(admin)}&organizationName=${encodeURIComponent(orgName)}`);
      const allTestimonials = await res.json();
      const testimonialsWrapper = document.getElementById("testimonials-container");
      const scrollLeftBtn = document.getElementById("scroll-left");
      const scrollRightBtn = document.getElementById("scroll-right");
  
      let currentIndex = 0;
      const itemsPerPage = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
      
      function renderTestimonials() {
        testimonialsWrapper.innerHTML = '';
        
        // Determine which testimonials to show
        const endIndex = Math.min(currentIndex + itemsPerPage, allTestimonials.length);
        
        for (let i = currentIndex; i < endIndex; i++) {
          const t = allTestimonials[i];
          const stars = "★".repeat(t.star) + "☆".repeat(5 - t.star);

          const card = document.createElement("div");
          card.className = `${cardBg} rounded-xl p-6 shadow-sm border ${borderColor} hover:shadow-md transition-all duration-300 h-full flex flex-col`;
          card.innerHTML = `
            <div class="flex-grow">
              <div class="flex items-center gap-4 mb-4">
                <img src="${t.photo}" alt="${t.name}" class="w-12 h-12 rounded-full object-cover">
                <div>
                  <h3 class="text-lg font-semibold">${t.name}</h3>
                  <p class="text-sm ${secondaryText}">${t.email}</p>
                </div>
              </div>
              <div class="flex gap-1 text-yellow-400 text-lg mb-4">
                ${stars.split('').map(s => `<span>${s}</span>`).join('')}
              </div>
              <p class="${textColor} text-base">"${t.text}"</p>
            </div>
          `;
          testimonialsWrapper.appendChild(card);
        }
        
        // Disable buttons when at boundaries
        scrollLeftBtn.disabled = currentIndex === 0;
        scrollRightBtn.disabled = currentIndex + itemsPerPage >= allTestimonials.length;
      }
  
      // Navigation
      scrollLeftBtn.addEventListener('click', () => {
        currentIndex = Math.max(0, currentIndex - itemsPerPage);
        renderTestimonials();
      });
  
      scrollRightBtn.addEventListener('click', () => {
        currentIndex = Math.min(allTestimonials.length - itemsPerPage, currentIndex + itemsPerPage);
        renderTestimonials();
      });
  
      // Handle window resize
      function handleResize() {
        const newItemsPerPage = window.innerWidth < 768 ? 1 : window.innerWidth < 1024 ? 2 : 3;
        if (newItemsPerPage !== itemsPerPage) {
          itemsPerPage = newItemsPerPage;
          currentIndex = Math.min(currentIndex, allTestimonials.length - itemsPerPage);
          renderTestimonials();
        }
      }
      
      window.addEventListener('resize', handleResize);
  
      // Initial render
      renderTestimonials();
  
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      container.innerHTML = `
        <div class="${bgColor} ${textColor} py-12 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto ${isDark ? 'text-red-400' : 'text-red-600'}" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="mt-2 text-lg font-medium">Failed to load testimonials</h3>
          <p class="mt-1 ${secondaryText}">Please try again later or contact support</p>
          <button onclick="window.location.reload()" class="mt-4 px-4 py-2 ${isDark ? 'bg-blue-600 hover:bg-blue-700' : 'bg-blue-500 hover:bg-blue-600'} text-white rounded-md transition-colors">
            Retry
          </button>
        </div>
      `;
    }
  });