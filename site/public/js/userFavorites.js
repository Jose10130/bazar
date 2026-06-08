document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll(".add-to-favorites");

  buttons.forEach((button) => {
    const icon = button.querySelector("i");
    if (!icon) return;

    const isFavoriteInitial = icon.classList.contains("fa-solid");
    button.classList.toggle("is-favorite", isFavoriteInitial);

    if (button.disabled) return;

    button.addEventListener("click", async (event) => {
      event.preventDefault();

      const productId = button.getAttribute("data-product-id");
      const isFavorite = button.classList.contains("is-favorite");

      try {
        const response = await fetch(
          isFavorite
            ? `/perfil/remover-favorito/${productId}`
            : `/perfil/agregar-favorito/${productId}`,
          {
            method: isFavorite ? "DELETE" : "POST",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          let message = "No se pudo actualizar el favorito.";
          try {
            const data = await response.json();
            if (data?.message) message = data.message;
          } catch (_) {}
          throw new Error(message);
        }

        const data = await response.json().catch(() => null);

        button.classList.toggle("is-favorite");
        icon.classList.toggle("fa-solid");
        icon.classList.toggle("fa-regular");

        if (data?.message) {
          console.log(data.message);
        }
      } catch (error) {
        console.error("Error favoritos:", error);
        alert(error.message || "No se pudo actualizar el favorito.");
      }
    });
  });
});