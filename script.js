document.addEventListener("DOMContentLoaded", async () => {
    // Dynamic Projects Fetching and Rendering
    const projectsContainer = document.getElementById("dynamic-projects-container");
    if (projectsContainer) {
        try {
            const response = await fetch("data/projects.json");
            if (!response.ok) throw new Error("Failed to load projects data.");

            const projects = await response.json();
            projectsContainer.innerHTML = ""; // Clear loader if any

            projects.forEach((project, index) => {
                const delayAttr = (index % 2 !== 0) ? `data-aos-delay="100"` : '';

                const html = `
                    <a href="${project.link}" class="group block" data-aos="fade-up" ${delayAttr}>
                        <div class="overflow-hidden mb-6 bg-charcoal aspect-[4/3]">
                            <img src="${project.coverImage}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                        </div>
                        <div class="flex justify-between items-baseline">
                            <h2 class="text-3xl font-serif">${project.title}</h2>
                            <span class="text-concrete text-sm">${project.number}</span>
                        </div>
                        <p class="text-concrete mt-2">${project.subheading}</p>
                    </a>
                `;
                projectsContainer.insertAdjacentHTML('beforeend', html);
            });

            // Re-initialize AOS to pick up new dynamic elements if needed,
            // though typical AOS setups attach to the document flow.
            if (typeof AOS !== 'undefined') {
                setTimeout(() => AOS.refresh(), 100);
            }
        } catch (error) {
            console.error("Error fetching projects:", error);
            projectsContainer.innerHTML = `<p class="text-concrete">Projects could not be loaded at this time.</p>`;
        }
    }

    // Mobile Menu Logic
    const menuBtn = document.getElementById("menu-btn");
    const closeMenuBtn = document.getElementById("close-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (menuBtn && mobileMenu && closeMenuBtn) {
        menuBtn.addEventListener("click", () => {
            mobileMenu.classList.add("open");
            document.body.style.overflow = "hidden"; // Prevent scrolling when menu is open
        });

        closeMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.remove("open");
            document.body.style.overflow = ""; // Re-enable scrolling
        });

        // Close menu when clicking on a link
        const menuLinks = mobileMenu.querySelectorAll("a");
        menuLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileMenu.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }

    // Lightbox Logic
    const lightbox = document.getElementById("lightbox");
    const lightboxImg = document.getElementById("lightbox-img");
    const closeLightboxBtn = document.getElementById("close-lightbox");
    const galleryImages = document.querySelectorAll(".gallery-img");

    if (lightbox && lightboxImg && closeLightboxBtn) {
        galleryImages.forEach(img => {
            img.addEventListener("click", (e) => {
                const imgSrc = e.target.getAttribute("src");
                if (imgSrc) {
                    lightboxImg.setAttribute("src", imgSrc);
                    lightbox.classList.add("active");
                    document.body.style.overflow = "hidden"; // Prevent background scroll
                }
            });
        });

        const closeLightbox = () => {
            lightbox.classList.remove("active");
            document.body.style.overflow = "";
            setTimeout(() => {
                lightboxImg.setAttribute("src", ""); // Clear image source after transition
            }, 300);
        };

        closeLightboxBtn.addEventListener("click", closeLightbox);

        // Close on clicking outside the image
        lightbox.addEventListener("click", (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });

        // Close on Escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && lightbox.classList.contains("active")) {
                closeLightbox();
            }
        });
    }
});
