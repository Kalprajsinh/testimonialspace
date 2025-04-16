document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("testimonial");
  const admin = container.getAttribute("admin");
  const orgName = container.getAttribute("organization");
  const theme = container.getAttribute("theme");

  // Determine theme colors
  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-black" : "bg-white";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryText = isDark ? "text-gray-300" : "text-gray-600";
  const cardBg = isDark ? "bg-zinc-900" : "bg-gray-100";
  const quoteColor = isDark ? "text-gray-200" : "text-gray-800";

  container.innerHTML = `
    <div class="${bgColor} ${textColor} py-16 px-6">
      <div class="max-w-7xl mx-auto">
        <h1 class="text-4xl font-bold text-center mb-4">Customer Success Stories</h1>
        <p class="text-center text-lg mb-12 ${secondaryText}">See how businesses like yours are growing with our platform</p>
        <div id="testimonials-wrapper" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"></div>
      </div>
    </div>
  `;

  try {
    const res = await fetch(`https://testimonialspace.onrender.com/api/favorite?admin=${encodeURIComponent(admin)}&organizationName=${encodeURIComponent(orgName)}`);
    const testimonials = await res.json();
    const wrapper = document.getElementById("testimonials-wrapper");

    testimonials.forEach(t => {
      const stars = "★".repeat(t.star) + "☆".repeat(5 - t.star);

      const card = document.createElement("div");
      card.className = `${cardBg} rounded-2xl p-6 shadow-md`;
      card.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <Image src="${t.photo}" alt="${t.name}" class="w-14 h-14 rounded-full object-cover">
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
    });

  } catch (error) {
    console.error("Error fetching testimonials:", error);
  }
});



  // <div id="testimonial" organization="codepoint"></div>
  // <script src="https://mywebsite/script.js"></script>
  // <script src="https://cdn.tailwindcss.com"></script>

// https://dribbble.com/shots/5256055-Testimonials