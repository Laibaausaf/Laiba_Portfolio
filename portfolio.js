
// Portfolio interactivity using DOM selection and event listeners.
document.addEventListener('DOMContentLoaded', function () {

    // Select DOM elements
    const body = document.body;
    const nav = document.querySelector('nav');
    const navList = nav.querySelector('ul');

    // Create Theme Toggle Button
    const theme = document.createElement('button');

    theme.className = 'theme-toggle';
    theme.type = 'button';
    theme.id = 'themeToggle';
    theme.textContent = '☼';
    theme.title = 'Switch light/dark theme';
    theme.setAttribute('aria-label', 'Switch theme');

    nav.appendChild(theme);

    // Create Mobile Menu Toggle Button
    const menu = document.createElement('button');

    menu.className = 'menu-toggle';
    menu.type = 'button';
    menu.id = 'menuToggle';
    menu.textContent = '☰';
    menu.setAttribute('aria-label', 'Open menu');
    menu.setAttribute('aria-expanded', 'false');

    nav.insertBefore(menu, navList);

    // Theme Toggle Functionality
    theme.addEventListener('click', function () {

        body.classList.toggle('light-theme');

        const light = body.classList.contains('light-theme');

        theme.textContent = light ? '☾' : '☼';

        theme.setAttribute(
            'aria-label',
            light ? 'Switch to dark theme' : 'Switch to light theme'
        );
    });

    // Mobile Menu Toggle Functionality
    menu.addEventListener('click', function () {

        const open = navList.classList.toggle('open');

        menu.textContent = open ? '×' : '☰';

        menu.setAttribute('aria-expanded', open);
    });

    // Close Mobile Menu When a Navigation Link Is Clicked
    nav.querySelectorAll('a').forEach(function (link) {

        link.addEventListener('click', function () {

            navList.classList.remove('open');

            menu.textContent = '☰';

            menu.setAttribute('aria-expanded', 'false');
        });
    });

    // Scroll Progress and Back-to-Top Elements
    const progress = document.getElementById('scrollProgress');
    const topButton = document.getElementById('backToTop');

    // Update Scroll Progress and Active Navigation Link
    function updateScroll() {

        const max = document.documentElement.scrollHeight - window.innerHeight;

        progress.style.width =
            (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';

        // Show or Hide Back-to-Top Button
        topButton.classList.toggle('visible', window.scrollY > 350);

        // Detect Current Section
        let current = 'home';

        document.querySelectorAll('main section[id]').forEach(function (section) {

            if (window.scrollY >= section.offsetTop - 150) {
                current = section.id;
            }
        });

        // Update Active Navigation Link
        nav.querySelectorAll('a[href^="#"]').forEach(function (a) {

            a.classList.toggle(
                'active',
                a.getAttribute('href') === '#' + current
            );
        });
    }

    // Scroll Event Listener
    window.addEventListener('scroll', updateScroll);

    updateScroll();

    // Back-to-Top Button Functionality
    topButton.addEventListener('click', function () {

        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Scroll Reveal Animation
    const items = document.querySelectorAll(
        'main section, #projects article'
    );

    if ('IntersectionObserver' in window) {

        const observer = new IntersectionObserver(
            function (entries, obs) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add('visible');

                        obs.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1
            }
        );

        items.forEach(function (item) {

            item.classList.add('reveal');

            observer.observe(item);
        });

    } else {

        // Fallback for browsers without IntersectionObserver
        items.forEach(function (item) {

            item.classList.add('visible');
        });
    }

    // Project Card Selection
    const cards = document.querySelectorAll('#projects article');

    cards.forEach(function (card) {

        card.addEventListener('click', function () {

            cards.forEach(function (c) {

                c.classList.remove('selected');
            });

            card.classList.add('selected');
        });
    });

    // Contact Form Functionality
    const form = document.getElementById('contactForm');
    const success = document.getElementById('formSuccess');

    if (form) {

        form.addEventListener('submit', function (event) {

            event.preventDefault();

            // Get and validate form values
            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            // Check required fields
            if (!name || !email || !message) {

                success.textContent =
                    'Please complete your name, email, and message.';

                return;
            }

            // Display Success Message
            success.textContent =
                'Thanks, ' + name +
                '! This demo confirms your message locally but does not send emails yet.';

            // Reset Contact Form
            form.reset();
        });
    }

});
