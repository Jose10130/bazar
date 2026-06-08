document.addEventListener("DOMContentLoaded", () => {
  const productTitleElements = document.querySelectorAll(".product-title");
  const productDescriptionElements = document.querySelectorAll(".product-description");

  productTitleElements.forEach((element) => {
    const text = element.textContent.trim();
    if (text.length > 22) {
      element.textContent = text.slice(0, 22) + "...";
    }
  });

  productDescriptionElements.forEach((element) => {
    const text = element.textContent.trim();
    if (text.length > 50) {
      element.textContent = text.slice(0, 50) + "...";
    }
  });

  setTimeout(() => {
    const chatBubble = document.querySelector(".chat-bubble");
    if (chatBubble) {
      chatBubble.style.display = "block";
    }
  }, 7000);
});