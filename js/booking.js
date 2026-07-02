// Coldman Booking Landing — shared JS
// Replace FORMSPREE_ID with the real endpoint before launch.

(() => {
  const FORMSPREE_ID = "xpzgwqab"; // placeholder; swap on deploy

  // FAQ accordion
  document.querySelectorAll(".faq__item").forEach((item) => {
    const q = item.querySelector(".faq__q");
    q.addEventListener("click", () => {
      const isOpen = item.classList.contains("is-open");
      document.querySelectorAll(".faq__item.is-open").forEach((other) => {
        if (other !== item) other.classList.remove("is-open");
      });
      item.classList.toggle("is-open", !isOpen);
    });
  });

  // Reveal on scroll
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-shown");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

  // Lead form — Formspree
  const form = document.querySelector("[data-lead-form]");
  if (form) {
    const success = form.querySelector(".form__success");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submit = form.querySelector("[type=submit]");
      const originalText = submit.textContent;
      submit.disabled = true;
      submit.textContent = submit.dataset.sending || "Sending…";
      try {
        const data = new FormData(form);
        const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: "POST",
          body: data,
          headers: { Accept: "application/json" },
        });
        if (res.ok) {
          form.reset();
          if (success) success.classList.add("is-shown");
          submit.textContent = submit.dataset.sent || "Sent ✓";
          setTimeout(() => (submit.textContent = originalText), 2400);
        } else {
          throw new Error("form error");
        }
      } catch (err) {
        submit.textContent = submit.dataset.error || "Try again";
      } finally {
        submit.disabled = false;
        setTimeout(() => {
          submit.textContent = originalText;
        }, 3000);
      }
    });
  }

  // Year in footer
  const y = document.querySelector("[data-year]");
  if (y) y.textContent = new Date().getFullYear();
})();
