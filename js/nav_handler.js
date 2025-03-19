document.addEventListener("DOMContentLoaded", function () {
    const sections = document.querySelectorAll("section");
    const navItems = document.querySelectorAll(".nav--indicator__item");

    const observer = new IntersectionObserver((entries) => {
        let found = false; 
        entries.forEach((entry) => {
            if (entry.isIntersecting && !found) {
                found = true;
                const sectionId = entry.target.id;

                // deactivate all navigation items
                navItems.forEach((item) => {
                    item.classList.remove("active");
                });

                // activate the current navigation item
                const activeNavItem = document.querySelector(`.nav--indicator__item[data-section="${sectionId}"]`);
                if (activeNavItem) {
                    activeNavItem.classList.add("active");
                }
            }
        });
    }, { threshold: 0.6 }); // visible at 60%

    sections.forEach((section) => {
        observer.observe(section);
    });
});
