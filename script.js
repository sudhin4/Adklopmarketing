const menu = document.querySelector(".menu");
const nav = document.querySelector(".nav nav");

menu?.addEventListener("click", () => {

    menu.classList.toggle("active");
    nav.classList.toggle("open");

    const isOpen = nav.classList.contains("open");

    document.body.style.overflow = isOpen
        ? "hidden"
        : "";

});
document.querySelectorAll(".nav nav a").forEach(link => {

    link.addEventListener("click", () => {

        nav.classList.remove("open");
        menu.classList.remove("active");

        document.body.style.overflow = "";

    });

});

// General section reveal
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Progressive word reveal for the problem paragraph
const scrollText = document.querySelector('.scroll-text-reveal');

if (scrollText) {
  const words = scrollText.textContent.trim().split(/\s+/);
  scrollText.innerHTML = words.map(word => `<span class="word">${word}</span>`).join(' ');

  const updateTextReveal = () => {
    const rect = scrollText.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const start = viewportH * 0.88;
    const end = viewportH * 0.30;
    const progress = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
    const wordEls = scrollText.querySelectorAll('.word');
    const visibleCount = Math.floor(progress * wordEls.length);

    wordEls.forEach((word, index) => {
      word.classList.toggle('is-revealed', index < visibleCount);
    });
  };

  window.addEventListener('scroll', updateTextReveal, { passive: true });
  window.addEventListener('resize', updateTextReveal);
  updateTextReveal();
}

// How We Work progress + sequential activation
const process = document.querySelector('.process-timeline');
const processProgress = document.querySelector('.process-progress');
const processCards = [...document.querySelectorAll('.process-timeline article')];

const updateProcess = () => {
  if (!process || !processProgress || !processCards.length) return;

  const rect = process.getBoundingClientRect();
  const viewportH = window.innerHeight;
  const start = viewportH * 0.82;
  const end = viewportH * 0.28;
  const progress = Math.max(0, Math.min(1, (start - rect.top) / (rect.height + start - end)));

  processProgress.style.height = `${progress * Math.max(0, process.offsetHeight - 40)}px`;

  processCards.forEach((card, index) => {
    const threshold = (index + 0.25) / processCards.length;
    card.classList.toggle('process-active', progress >= threshold);
  });
};

window.addEventListener('scroll', updateProcess, { passive: true });
window.addEventListener('resize', updateProcess);
updateProcess();

// Smooth FAQ accordion with + / − icon handled by CSS
const detailsEls = [...document.querySelectorAll('.faqs details')];

detailsEls.forEach(details => {
  const summary = details.querySelector('summary');
  const answer = details.querySelector('.faq-answer');

  summary?.addEventListener('click', event => {
    event.preventDefault();

    const isOpen = details.open;

    // Close other FAQs
    detailsEls.forEach(other => {
      if (other !== details && other.open) {
        const otherAnswer = other.querySelector('.faq-answer');
        const startHeight = other.offsetHeight;
        const endHeight = other.querySelector('summary').offsetHeight;

        other.animate(
          [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
          { duration: 360, easing: 'cubic-bezier(.2,.75,.25,1)' }
        ).onfinish = () => {
          other.open = false;
          other.style.height = '';
          otherAnswer?.getAnimations().forEach(a => a.cancel());
        };
      }
    });

    if (isOpen) {
      const startHeight = details.offsetHeight;
      const endHeight = summary.offsetHeight;

      const animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: 380, easing: 'cubic-bezier(.2,.75,.25,1)' }
      );
      animation.onfinish = () => {
        details.open = false;
        details.style.height = '';
      };
    } else {
      details.open = true;
      const startHeight = summary.offsetHeight;
      const endHeight = summary.offsetHeight + answer.scrollHeight;

      const animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: 430, easing: 'cubic-bezier(.2,.75,.25,1)' }
      );
      animation.onfinish = () => {
        details.style.height = '';
      };
    }
  });
});

// Lead modal
const modal = document.getElementById('leadModal');

const openModal = () => {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  setTimeout(() => modal.querySelector('input')?.focus(), 50);
};

const closeModal = () => {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.querySelectorAll('.js-open').forEach(button => button.addEventListener('click', openModal));
document.querySelectorAll('.js-close').forEach(button => button.addEventListener('click', closeModal));
document.addEventListener('keydown', event => {
  if (event.key === 'Escape') closeModal();
});

// Lead form
emailjs.init({
  publicKey: "L75fhB_3laavfX49d"
});

const form = document.getElementById("leadForm");
const status = form.querySelector(".form-status");
const submitButton = form.querySelector('button[type="submit"]');

form.addEventListener("submit", function (event) {
  event.preventDefault();

  status.textContent = "Sending...";
  submitButton.disabled = true;
  submitButton.textContent = "Sending...";

  emailjs.sendForm(
    "service_oc00csz",
    "template_k8ebekq",
    this
  )
  .then(() => {

    status.textContent = "Thank you! We'll contact you soon.";

    form.reset();

    submitButton.disabled = false;
    submitButton.textContent = "Submit";

    setTimeout(() => {
      closeModal();
      status.textContent = "";
    }, 1800);

  })
  .catch((error) => {

    console.error("EmailJS Error:", error);

    status.textContent =
      "Something went wrong. Please try again.";

    submitButton.disabled = false;
    submitButton.textContent = "Submit";
  });
});
