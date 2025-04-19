document.addEventListener("DOMContentLoaded", async function () {
  const container = document.getElementById("testimonial");
  const admin = container.getAttribute("admin");
  const orgName = container.getAttribute("organization");
  const theme = container.getAttribute("theme");

  const isDark = theme === "dark";
  const bgColor = isDark ? "bg-zinc-950" : "bg-transparent";
  const textColor = isDark ? "text-white" : "text-gray-900";
  const secondaryText = isDark ? "text-gray-400" : "text-gray-600";
  const cardBg = isDark ? "bg-zinc-900" : "bg-white";
  const quoteColor = isDark ? "text-gray-200" : "text-gray-800";
  const borderColor = isDark ? "border-zinc-800" : "border-gray-200";

  container.innerHTML = `
    <section class="${bgColor} ${textColor} py-20 px-6">
      <div class="max-w-7xl mx-auto text-center">
        <h2 class="text-4xl font-extrabold tracking-tight mb-4">Customer Success Stories</h2>
        <p class="text-lg ${secondaryText} mb-12">See how businesses like yours are growing with our platform</p>
        <div id="testimonials-wrapper" class="grid gap-10 sm:grid-cols-2 lg:grid-cols-3"></div>
      </div>
    </section>
  `;

  try {
    const res = await fetch(`http://localhost:3001/api/favorite?admin=${encodeURIComponent(admin)}&organizationName=${encodeURIComponent(orgName)}`);
    const testimonials = await res.json();
    const wrapper = document.getElementById("testimonials-wrapper");

    testimonials.forEach(t => {
      const stars = "★".repeat(t.star) + "☆".repeat(5 - t.star);

      const card = document.createElement("div");
      card.className = `
        ${cardBg} ${borderColor} border rounded-2xl shadow-sm hover:shadow-lg hover:border-blue-800 transition-all duration-300 p-6 text-left
      `;

      card.innerHTML = `
        <div class="flex items-center gap-4 mb-4">
          <img src="${t.photo}" alt="${t.name}" class="w-14 h-14 rounded-full object-cover border border-gray-300">
          <div>
            <h3 class="text-lg font-semibold">${t.name}</h3>
            <p class="text-sm ${secondaryText}">${t.email}</p>
          </div>
        </div>
        <div class="flex gap-1 text-yellow-400 text-base mb-4">
          ${stars.split('').map(s => `<span>${s}</span>`).join('')}
        </div>
        <blockquote class="${quoteColor} text-base leading-relaxed italic">"${t.text}"</blockquote>
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