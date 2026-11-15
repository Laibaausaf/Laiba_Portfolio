// Portfolio interactivity.
document.addEventListener('DOMContentLoaded', function () {

    const body = document.body;
    const nav = document.querySelector('nav');
    const navList = nav.querySelector('ul');

    // 3. Light / dark theme switcher.
    const themeButton = document.createElement('button');
    themeButton.className = 'theme-toggle';
    themeButton.type = 'button';
    themeButton.id = 'themeToggle';
    themeButton.textContent = '☼';
    themeButton.title = 'Toggle Light/Dark Mode';
    themeButton.setAttribute('aria-label', 'Toggle Light/Dark Mode');
    nav.appendChild(themeButton);

    themeButton.addEventListener('click', function () {
        body.classList.toggle('light-theme');

        const isLight = body.classList.contains('light-theme');
        themeButton.textContent = isLight ? '☾' : '☼';
    });

    // Mobile navigation menu.
    const menuButton = document.createElement('button');
    menuButton.className = 'menu-toggle';
    menuButton.type = 'button';
    menuButton.textContent = '☰';
    menuButton.setAttribute('aria-label', 'Open menu');
    menuButton.setAttribute('aria-expanded', 'false');
    nav.insertBefore(menuButton, navList);

    menuButton.addEventListener('click', function () {
        const isOpen = navList.classList.toggle('open');
        menuButton.textContent = isOpen ? '×' : '☰';
        menuButton.setAttribute('aria-expanded', isOpen);
    });

    nav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            navList.classList.remove('open');
            menuButton.textContent = '☰';
            menuButton.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll progress and back-to-top button.
    const progress = document.getElementById('scrollProgress');
    const topButton = document.getElementById('backToTop');

    function updateScroll() {
        const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

        if (progress) {
            progress.style.width =
                (maxScroll > 0 ? window.scrollY / maxScroll * 100 : 0) + '%';
        }

        if (topButton) {
            topButton.classList.toggle('visible', window.scrollY > 350);
        }

        let currentSection = 'home';

        document.querySelectorAll('main section[id]').forEach(function (section) {
            if (window.scrollY >= section.offsetTop - 150) {
                currentSection = section.id;
            }
        });

        nav.querySelectorAll('a[href^="#"]').forEach(function (link) {
            link.classList.toggle(
                'active',
                link.getAttribute('href') === '#' + currentSection
            );
        });
    }

    window.addEventListener('scroll', updateScroll);
    updateScroll();

    if (topButton) {
        topButton.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Reveal sections as they appear on screen.
    const revealItems = document.querySelectorAll('main section, #projects article');

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(function (entries, obs) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealItems.forEach(function (item) {
            item.classList.add('reveal');
            observer.observe(item);
        });
    } else {
        revealItems.forEach(function (item) {
            item.classList.add('visible');
        });
    }

    // 2. Highlight rows in the Skills table.
    document.querySelectorAll('#skillsTable tbody tr, #skillsTable tr:not(:first-child)')
        .forEach(function (row) {
            row.addEventListener('mouseover', function () {
                row.classList.add('highlight-row');
            });

            row.addEventListener('mouseout', function () {
                row.classList.remove('highlight-row');
            });
        });

    // Keep the existing project-card selection interaction.
    const projectCards = document.querySelectorAll('#projects article');

    projectCards.forEach(function (card) {
        card.addEventListener('click', function () {
            projectCards.forEach(function (otherCard) {
                otherCard.classList.remove('selected');
            });
            card.classList.add('selected');
        });
    });

    // 6. Read More / Read Less in the About section.
    const readMoreButton = document.getElementById('readMoreButton');
    const aboutExtra = document.getElementById('aboutExtra');

    if (readMoreButton && aboutExtra) {
        readMoreButton.addEventListener('click', function () {
            aboutExtra.hidden = !aboutExtra.hidden;
            readMoreButton.textContent =
                aboutExtra.hidden ? 'Read More' : 'Read Less';
        });
    }

    // 7. Filter projects by category.
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            const category = button.dataset.filter;

            projectCards.forEach(function (card) {
                const showCard =
                    category === 'all' || card.dataset.category === category;

                card.style.display = showCard ? '' : 'none';
            });

            filterButtons.forEach(function (filter) {
                filter.classList.remove('active');
            });
            button.classList.add('active');
        });
    });

    // 1. Contact form validation and personalized confirmation.
    const form = document.getElementById('contactForm');
    const formSuccess = document.getElementById('formSuccess');

    if (form) {
        form.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (name === '' || email === '' || message === '') {
                formSuccess.textContent =
                    'Please complete your name, email, and message.';
                return;
            }

            formSuccess.textContent =
                'Thank you for visiting, ' + name +
                '! We will contact you at ' + email + '.';

            form.reset();
            updateCharacterCount();
        });
    }

    // 5. Convert the birth year to a number and show age eligibility.
    const birthYear = document.getElementById('birth-year');
    const ageMessage = document.getElementById('ageMessage');

    if (birthYear) {
        birthYear.addEventListener('input', function () {
            const year = parseInt(birthYear.value, 10);

            if (birthYear.value.trim() === '' || isNaN(year)) {
                ageMessage.textContent = '';
            } else if (year < 1900 || year > new Date().getFullYear()) {
                ageMessage.textContent = 'Please enter a valid birth year.';
            } else {
                const age = new Date().getFullYear() - year;

                if (age <= 25) {
                    ageMessage.textContent = 'You qualify for the student-age category.';
                } else if (age >= 60) {
                    ageMessage.textContent = 'You qualify for the senior-age category.';
                } else {
                    ageMessage.textContent = 'No age-based category applies.';
                }
            }
        });
    }

    // 9. Live character counter for the additional notes box.
    const specialNotes = document.getElementById('special-notes');
    const characterCount = document.getElementById('characterCount');

    function updateCharacterCount() {
        if (specialNotes && characterCount) {
            const remaining = 100 - specialNotes.value.length;
            characterCount.textContent = remaining + ' characters remaining';
        }
    }

    if (specialNotes) {
        specialNotes.addEventListener('input', updateCharacterCount);
        updateCharacterCount();
    }
});
