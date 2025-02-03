<template>
  <div class="socials-container">
    <a
      v-for="(icon, index) in socialIcons"
      :key="index"
      :href="icon.link"
      target="_blank"
      class="social-icon-container"
    >
      <v-img :src="icon.src" :alt="icon.alt" class="social-icon" />
    </a>
  </div>
</template>
<script setup>
const socialIcons = [
  {
    src: require("@/assets/social-icons/facebook.svg"),
    link: "https://www.facebook.com/doganledd/",
    alt: "Facebook",
  },
  {
    src: require("@/assets/social-icons/instagram.svg"),
    link: "https://www.instagram.com/doganledd/",
    alt: "Instagram",
  },
  {
    src: require("@/assets/social-icons/linkedin.svg"),
    link: "https://www.linkedin.com/company/do%C4%9Fan-led/",
    alt: "LinkedIn",
  },
  {
    src: require("@/assets/social-icons/youtube.svg"),
    link: "https://www.youtube.com/@doganledaydinlatma2336",
    alt: "Youtube",
  },
];
</script>
