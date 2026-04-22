document.addEventListener("DOMContentLoaded", () => {
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
