<template>
  <footer class="footer">
    <div
      class="container mx-auto text-center py-4 flex justify-between items-center"
    >
      <span class="hoverable-text">
        © 2024 runR, Inc. -
        <span class="hoverable">Demonstrate</span> |
        <span class="hoverable">Innovate</span> |
        <span class="hoverable">Explore</span> |
        <span class="hoverable">Perform</span>
      </span>
      <div class="flex space-x-4">
        <a
          href="https://github.com/raymonepping"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-brightred transition ease-in-out duration-300"
        >
          <i class="fab fa-github"></i>
        </a>
        <a
          href="https://x.com/doctor_nosql"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-brightred transition ease-in-out duration-300"
        >
          <i class="fab fa-twitter"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/raymonepping/"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-brightred transition ease-in-out duration-300"
        >
          <i class="fab fa-linkedin-in"></i>
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No additional script logic is needed for this component
</script>

<style scoped>
.footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: linear-gradient(
    to top right,
    rgba(70, 70, 70, 0.7),
    rgba(20, 20, 20, 0.7)
  );
  color: #ffffff;
  font-family: 'Open Sans', sans-serif;
  font-size: 16px;
  border-top: 1px solid #e7e7e7;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  z-index: 50;
  opacity: 0.9;
}

a {
  color: #ffffff;
  font-size: 20px;
  padding: 10px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 50%;
  transition:
    background-color 0.3s ease-in-out,
    transform 0.3s ease-in-out;
}

a:hover {
  background-color: #c8c8c8;
  color: #ffffff;
  transform: scale(1.2);
}

/* Add hover effect for the words */
.hoverable {
  display: inline-block;
  transition:
    transform 0.1s ease-in-out,
    color 0.1s ease-in-out;
  cursor: pointer;
}

.hoverable:hover {
  transform: scale(1.1);
  color: #cbcaca;
}

@media (max-width: 640px) {
  .footer {
    flex-direction: column;
    text-align: center;
  }

  .footer .flex {
    margin-top: 10px;
  }
}

.footer span {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}
</style>
