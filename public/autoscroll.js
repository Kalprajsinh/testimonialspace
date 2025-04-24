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
    const quoteColor = isDark ? "text-gray-200" : "text-gray-800";
  
    container.innerHTML = `
      <div class="${bgColor} ${textColor} py-16 px-6">
        <div class="max-w-7xl mx-auto relative">
          <div class="absolute -bottom-3 right-0 text-xs text-gray-400 opacity-50">Powered by <a href="http://localhost:3000">TestimonialSpace</a></div>
          <h1 class="text-4xl font-bold text-center mb-4">Customer Success Stories</h1>
          <p class="text-center text-lg mb-12 ${secondaryText}">See how businesses like yours are growing with our platform</p>
          <div class="relative overflow-hidden">
            <div id="testimonials-wrapper" class="flex"></div>
            <div id="testimonials-clone" class="flex absolute top-0 left-0"></div>
          </div>
        </div>
      </div>
    `;
  
    try {
      const res = await fetch(`http://localhost:3001/api/favorite?admin=${encodeURIComponent(admin)}&organizationName=${encodeURIComponent(orgName)}`);
      const testimonials = await res.json();
      const wrapper = document.getElementById("testimonials-wrapper");
      const cloneWrapper = document.getElementById("testimonials-clone");
  
      // Create testimonial cards
      testimonials.forEach(t => {
        const stars = "★".repeat(t.star) + "☆".repeat(5 - t.star);
  
        const card = document.createElement("div");
        card.className = `${cardBg} rounded-2xl p-6 shadow-md m-2 border hover:border-blue-500 w-full`;
        card.innerHTML = `
          <div class="flex items-center gap-4 mb-4">
            <img src="${t.photo}" alt="${t.name}" class="w-14 h-14 rounded-full object-cover">
            <div>
              <h3 class="text-lg font-semibold">${t.name}</h3>
              <p class="text-sm ${secondaryText}">${t.email}</p>
            </div>
          </div>
          <div class="flex gap-1 text-yellow-400 text-lg mb-4">
            ${stars.split('').map(s => `<span>${s}</span>`).join('')}
          </div>
          <p class="${quoteColor} text-base">"${t.text}"</p>
        `;
        wrapper.appendChild(card);
        
        // Clone the card for seamless looping
        const clonedCard = card.cloneNode(true);
        cloneWrapper.appendChild(clonedCard);
      });
  
      // Set up auto-scroll animation
      const scrollContainer = wrapper.parentElement;
      const scrollWidth = wrapper.scrollWidth;
      let scrollPosition = 0;
      
      // Set the clone wrapper width to match original
      cloneWrapper.style.width = `${scrollWidth}px`;
      
      // Animation function
      function scrollTestimonials() {
        scrollPosition -= 1; // Adjust speed by changing this value
        
        if (scrollPosition <= -scrollWidth) {
          scrollPosition = 0;
        }
        
        wrapper.style.transform = `translateX(${scrollPosition}px)`;
        cloneWrapper.style.transform = `translateX(${scrollPosition + scrollWidth}px)`;
        
        requestAnimationFrame(scrollTestimonials);
      }
      
      // Start the animation
      scrollTestimonials();
  
    } catch (error) {
      console.error("Error fetching testimonials:", error);
    }
  });
  