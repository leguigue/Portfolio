document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector(".menu");
  const burger = document.querySelector(".burger");
  const menuIcon = document.querySelector("#menuclosed");
  burger.addEventListener("click", toggleMenu);
  function toggleMenu() {
      menu.classList.toggle('hidden');
      if (menu.classList.contains('hidden')) {
          menuIcon.src = "./assets/images/menuclosed.svg";
          menuIcon.classList.add("closed");
          menuIcon.classList.remove("opened");
          menu.style.display = "none";
      } else {
          menuIcon.src = "./assets/images/menuopened.svg";
          menuIcon.classList.remove("closed");
          menuIcon.classList.add("opened");
          menu.style.display = "block";
      }
  }
  if (menu.classList.contains('hidden')) {
      menu.style.display = "none";
  }
});