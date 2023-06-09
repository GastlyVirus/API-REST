const URL = "https://api.thecatapi.com/v1/images/search?limit=4";
const URL_Favourites = "https://api.thecatapi.com/v1/favourites";
const URL_Delete = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;
const URL_Upload = "https://api.thecatapi.com/v1/images/upload";
const img1 = document.getElementById("imagenAleatoria1");
const img2 = document.getElementById("imagenAleatoria2");
const img3 = document.getElementById("imagenAleatoria3");
const img4 = document.getElementById("imagenAleatoria4");
const checkIcon1 = document.getElementById("checkIcon1");
const checkIcon2 = document.getElementById("checkIcon2");
const checkIcon3 = document.getElementById("checkIcon3");
const checkIcon4 = document.getElementById("checkIcon4");
const botonSiguiente = document.getElementById("botonSiguiente");
const botonSubir = document.getElementById("botonSubir");
const spanError = document.getElementById("error");
const inputFile = document.getElementById('file');

async function imagenAleatoria() {
  const res = await fetch(URL);
  const data = await res.json();
  console.log("imagenAleatoria", data);
  if (res.status !== 200) {
    spanError.innerHTML = "Hubo un error:" + res.status;
  } else {
    img1.src = data[0].url;
    img2.src = data[1].url;
    img3.src = data[2].url;
    img4.src = data[3].url;

    checkIcon1.onclick = () => guardarImagenFavorita(data[0].id);
    checkIcon2.onclick = () => guardarImagenFavorita(data[1].id);
    checkIcon3.onclick = () => guardarImagenFavorita(data[2].id);
    checkIcon4.onclick = () => guardarImagenFavorita(data[3].id);
  }
}
window.addEventListener("load", imagenAleatoria);
botonSiguiente.addEventListener("click", imagenAleatoria);

async function imagenFavorita() {
  const res = await fetch(URL_Favourites, {
    method: "GET",
    headers: {
      "X-API-KEY":
        "live_jjsliyvCbyuzJAfWopFtDJRE7CTHVL7mI9AhOgI0TAyyVr2abQgPy5oU0mOCvb9F",
    },
  });
  const data = await res.json();
  console.log("imagenFavorita", data);
  if (res.status !== 200) {
    spanError.innerText = "Hubo un error:" + res.status + data.message;
  } else {
    const section = document.getElementById("sectionImagenFavoritos");
    section.innerHTML = "";
    data.forEach((gatito) => {
      const article = document.createElement("article");
      const img = document.createElement("img");
      const btn = document.createElement("button");
      const btnText = document.createTextNode("Borrar");

      article.id = "articleFavorito";
      img.id = "imgFavorito";
      img.src = gatito.image.url;
      btn.id = "botonBorrar";
      btn.appendChild(btnText);
      article.appendChild(img);
      section.appendChild(article);
      section.appendChild(btn);
      btn.onclick = () => borrarImagenFavorita(gatito.id);
    });
  }
}
window.addEventListener("load", imagenFavorita);

async function guardarImagenFavorita(id) {
  const res = await fetch(URL_Favourites, {
    method: "POST",
    headers: {
      "X-API-KEY":
        "live_jjsliyvCbyuzJAfWopFtDJRE7CTHVL7mI9AhOgI0TAyyVr2abQgPy5oU0mOCvb9F",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ image_id: id }),
  });
  const data = await res.json();
  console.log("guardar", res);
  if (res.status !== 200) {
    spanError.innerText = "Hubo un error:" + res.status + data.message;
  } else {
    console.log("Gatito guardado en favoritos");
    imagenFavorita();
  }
}

async function borrarImagenFavorita(id) {
  const res = await fetch(URL_Delete(id), {
    method: "DELETE",
    headers: {
      "X-API-KEY":
        "live_jjsliyvCbyuzJAfWopFtDJRE7CTHVL7mI9AhOgI0TAyyVr2abQgPy5oU0mOCvb9F",
    },
  });
  const data = await res.json();
  console.log("data", data);
  if (res.status !== 200) {
    spanError.innerText = "Hubo un error:" + res.status + data.message;
  } else {
    console.log("Gatito borrado en favoritos");
    imagenFavorita();
  }
}

async function subirFotoGatito() {
  const form = document.getElementById("subidaFormulario");
  const formData = new FormData(form);
  console.log(formData.get("file"));

  const res = await fetch(URL_Upload, {
    method: 'POST',
    headers: {
      'X-API-KEY':
        'live_jjsliyvCbyuzJAfWopFtDJRE7CTHVL7mI9AhOgI0TAyyVr2abQgPy5oU0mOCvb9F',
    },
    body: formData,
  });
  const data = await res.json();

  if (res.status !== 201) {
    spanError.innerHTML = "Hubo un error:" + res.status + data.message;
    console.log({data});
  } else {
    console.log("Foto subida de gatito");
    console.log({ data });
    console.log(data.url);
    guardarImagenFavorita(data.id);
    inputFile.value = '';
  }
}
botonSubir.addEventListener("click", subirFotoGatito);
