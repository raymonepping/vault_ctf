<template>
  <footer class="footer">
    <div
      class="container mx-auto text-center py-3 px-4 flex flex-col sm:flex-row justify-between items-center"
    >
      <span class="footer-text">
        © 2024 Vault Radar —
        <span class="buzz">Discover</span> •
        <span class="buzz">Defend</span> •
        <span class="buzz">Decrypt</span>
      </span>

      <div class="flex space-x-4 mt-2 sm:mt-0">
        <a
          href="https://github.com/raymonepping"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
        >
          <i class="fab fa-github"></i>
        </a>
        <a
          href="https://x.com/doctor_nosql"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="X / Twitter"
        >
          <i class="fab fa-twitter"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/raymonepping/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <i class="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No logic needed for now
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: #111; /* deep black */
  color: #facc15; /* yellow-400 */
  font-family: 'Orbitron', sans-serif;
  font-size: 0.95rem;
  border-top: 1px solid #333;
  height: 60px;
  z-index: 50;
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.2);
}

.footer-text {
  text-shadow: 1px 1px 3px rgba(255, 255, 0, 0.1);
}

.buzz {
  cursor: pointer;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
}
.buzz:hover {
  color: #fff176; /* softer yellow */
  transform: scale(1.1);
}

a {
  color: #facc15;
  font-size: 1.25rem;
  transition: color 0.2s ease-in-out, transform 0.2s ease-in-out;
}
a:hover {
  color: #fff;
  transform: scale(1.2);
}

@media (max-width: 640px) {
  .footer {
    height: auto;
    padding: 0.75rem 1rem;
  }

  .footer-text {
    margin-bottom: 0.5rem;
  }
}
</style>
