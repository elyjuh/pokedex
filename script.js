let currentId = 25;

document.addEventListener("DOMContentLoaded", () => {
    const sprite = document.getElementById("pokemonSprite");
    const nameInput = document.getElementById("pokemonName");
    const prevBtn = document.querySelector(".prev");
    const nextBtn = document.querySelector(".next");
    const searchBtn = document.querySelector(".searchBtn");
    const infoDisplay = document.getElementById("pokemonInfo");
    const typeContainer = document.getElementById("pokemonTypes");

    async function fetchPokemon(idOrName) {
        try {
        const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${idOrName.toString().toLowerCase()}`);
        if (!res.ok) throw new Error("Not found");

        const data = await res.json();

        sprite.classList.remove("visible");
        sprite.style.display = "none";
        sprite.src = data.sprites.front_default;
        sprite.onload = () => {
            sprite.style.display = "block";
            void sprite.offsetWidth;
            sprite.classList.add("visible");
        };

        const formattedId = data.id.toString().padStart(3, '0');
        infoDisplay.textContent = `#${formattedId} - ${capitalize(data.name)}`;
        currentId = data.id;

        typeContainer.innerHTML = "";
        data.types.forEach(({ type }) => {
            const icon = document.createElement("img");
            icon.src = `type-icons/${type.name}.png`;
            icon.alt = type.name;
            icon.title = capitalize(type.name);
            icon.classList.add("type-icon");
            typeContainer.appendChild(icon);
        });

        } catch (err) {
            console.error(err);
            alert(`No Pokémon found with ID or name: "${idOrName}"`);
            sprite.classList.remove("visible");
            sprite.style.display = "none";
            infoDisplay.textContent = "#000 - ???";
            typeContainer.innerHTML = "";
        }
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    fetchPokemon(currentId);

    prevBtn.addEventListener("click", () => {
        if (currentId > 1) {
        currentId--;
        fetchPokemon(currentId);
        }
    });

    nextBtn.addEventListener("click", () => {
        currentId++;
        fetchPokemon(currentId);
    });

    searchBtn.addEventListener("click", () => {
        const value = nameInput.value.trim();
        if (value) fetchPokemon(value);
    });
});
