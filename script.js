// dark mood  (theme options)
const themeToggleBtn = document.getElementById('theme-toggle'); 

if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
} else {
    document.documentElement.classList.remove('dark');
}

themeToggleBtn.addEventListener('click', function() {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('color-theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('color-theme', 'dark');
    }
});

const counters = document.querySelectorAll(".counter");

const animateCounter = (counter) => {
  const target = Number(counter.dataset.target);
  const duration = 2000;
  const startTime = performance.now();

  const updateCounter = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);

    // Ease-out animation
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    const currentValue = Math.floor(easedProgress * target);

    counter.textContent = `${currentValue}+`;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      counter.textContent = `${target}+`;
    }
  };

  requestAnimationFrame(updateCounter);
};

const observer = new IntersectionObserver(
  (entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target); // Runs only once
      }
    });
  },
  {
    threshold: 0.5,
  }
);

counters.forEach((counter) => observer.observe(counter));