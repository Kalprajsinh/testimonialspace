document.addEventListener("DOMContentLoaded", async function () {
    const container = document.getElementById("testimonial");
    const admin = container.getAttribute("admin");
    const orgName = container.getAttribute("organization");
    const theme = container.getAttribute("theme");

    // Determine theme colors
    const isDark = theme === "dark";
    const bgColor = isDark ? "bg-black" : "bg-transparent";
    const textColor = isDark ? "text-white" : "text-gray-900";
    const secondaryText = isDark ? "text-gray-400" : "text-gray-600";
    const cardBg = isDark ? "bg-zinc-900" : "bg-white";
    const quoteColor = isDark ? "text-gray-200" : "text-gray-800";
  
    // Fetch testimonials
    try {
        const res = await fetch(`https://testimonialspace-63bp.vercel.app/api/favorite?admin=${encodeURIComponent(admin)}&organizationName=${encodeURIComponent(orgName)}`);
        const testimonials = await res.json();
        const [first, second, third] = testimonials;

    
        container.innerHTML = `
          <div class="${bgColor} ${textColor} py-20 px-6">
            <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 items-center relative">
              <div class="absolute -bottom-10 right-0 text-sm text-gray-400 opacity-50">Powered by <a href="https://testimonialspace.vercel.app">TestimonialSpace</a></div>
              <!-- Column 1: Text Content -->
              <div>
                <p class="text-sm font-semibold text-violet-600 uppercase mb-2">Testimonial</p>
                <h2 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">What our users<br> say about us</h2>
                <p class="${secondaryText} text-lg mb-6">knowledge, expertise, advices & confidence</p>
                
              </div>
    
              <!-- Column 2: Single Centered Testimonial -->
              <div class="flex justify-center">
                <div class="${cardBg} p-6 rounded-2xl shadow-md w-full max-w-sm self-center">
                  <div class="flex gap-1 text-yellow-400 text-lg mb-4">
                    ${"★".repeat(first.star)}${"☆".repeat(5 - first.star)}
                  </div>
                  <p class="${quoteColor} mb-6">"${first.text}"</p>
                  <div class="flex items-center gap-4">
                    <img src="${first.photo}" alt="${first.name}" class="w-10 h-10 rounded-full object-cover">
                    <div>
                      <p class="font-semibold">${first.name}</p>
                      <p class="text-sm text-violet-600">${first.email}</p>
                    </div>
                  </div>
                </div>
              </div>
    
              <!-- Column 3: Two Testimonials Stacked and Centered -->
              <div class="flex flex-col items-center justify-center gap-6">
                ${[second, third].map(t => `
                  <div class="${cardBg} p-6 rounded-2xl shadow-md w-full max-w-sm">
                    <div class="flex gap-1 text-yellow-400 text-lg mb-4">
                      ${"★".repeat(t.star)}${"☆".repeat(5 - t.star)}
                    </div>
                    <p class="${quoteColor} mb-6">"${t.text}"</p>
                    <div class="flex items-center gap-4">
                      <img src="${t.photo}" alt="${t.name}" class="w-10 h-10 rounded-full object-cover">
                      <div>
                        <p class="font-semibold">${t.name}</p>
                        <p class="text-sm text-violet-600">${t.email}</p>
                      </div>
                    </div>
                  </div>
                `).join('')}
              </div>
    
            </div>
          </div>
        `;
      } catch (err) {
        console.error("Error loading testimonials:", err);
        container.innerHTML = `<div class="text-center text-red-500">Failed to load testimonials.</div>`;
      }
    });