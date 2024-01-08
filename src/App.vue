<template>
  <nav>
    <div class="center-column">
      <div class="hamburger" @click="toggleDropdown">
        <font-awesome-icon icon="fa-solid fa-bars" class="hamburger-icon" :class="{ 'dropdown-selected': showDropdown }"/>
      </div>
      <router-link to="/" id="logo">RebelSelves</router-link>
    </div>
    <div class="dropdown" :class="{ 'show-dropdown': showDropdown }">
      <router-link to="/" @click="toggleDropdown">Home</router-link>
      <router-link to="/app" @click="toggleDropdown">App</router-link>
      <router-link to="/about" @click="toggleDropdown">About</router-link>
      <router-link to="/reportbug" @click="toggleDropdown">Report Bug</router-link>
    </div>
  </nav>
  <router-view/>
</template>

<style>
#app {
  text-align: center;
}

nav {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0;
  background-color: var(--pink);
  width: 100vw;
}

.center-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
}

#logo {
  color: var(--black);
  font-weight: bold;
  font-size: 28px;
  text-decoration: none;
}

.hamburger-icon {
  color: var(--black);
  font-size: 28px;
  padding: 4px;
  border-radius: 3px;
}

.hamburger {
  cursor: pointer;
  transition-duration: 0.4s;
}

.hamburger:hover {
  background-color: #ffddd8;
}

.dropdown {
  display: none;
  position: absolute;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0px 8px 16px 0px rgba(0, 0, 0, 0.2);
  z-index: 1;
  margin-top: 50px;
}

.show-dropdown {
  display: block;
}

.dropdown-selected {
  color: var(--pink);
  background-color: var(--black);
}

.dropdown a {
  display: block;
  padding: 12px 16px;
  text-decoration: none;
  color: #2c3e50;
  transition: background-color 0.3s ease;
}

.dropdown a:hover {
  background-color: #f2f2f2;
}
</style>

<script>
export default {
  data() {
    return {
      showDropdown: false,
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
  },
};
</script>