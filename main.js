const form = document.querySelector("form");

form.addEventListener("submit", (event) => {
  event.preventDefault();
  let location = event.target.location.value;
  if (location.includes(" ")) {
    location = location.split(" ").join("+");
  }

  let url = `https://wttr.in/${location}?format=j1`;
  fetch(url)
    .then((response) => response.json())
    .then((locationData) => {
      formatLocationData(locationData);
      createPreviousSearch(location, locationData);
      createForecasting(locationData);
      form.reset();
    })
    .catch((error) => {
      console.log(error);
    });
});

const formatLocationData = (locationData) => {
  const { nearest_area, current_condition } = locationData;
  const [areaInfo] = nearest_area;
  const { areaName, country, region } = areaInfo;
  const feelsLike = current_condition[0].FeelsLikeF;

  const main = document.querySelector(".display");
  main.innerText = "";

  const h3 = document.createElement("h3");
  h3.innerText = `${areaName[0].value}`;
  main.prepend(h3);

  const div = document.createElement("div");
  div.innerHTML = `
    <p id="area" class="location-info">Area: ${areaName[0].value}</p>
    <p id="region" class="location-info">Region: ${region[0].value}</p>
    <p id="country" class="location-info">Country: ${country[0].value}</p>
    <p id="feels-like" class="location-info">Feels Like: ${feelsLike}°F</p>
     `;
  h3.after(div);
};

let formatLocation = (location) => {
    return location.slice(0,1).toUpperCase()+location.slice(1).toLowerCase();
}

const createPreviousSearch = (location, locationData) => {
  const orgLocation = location;
  document.querySelector("#previous-search-block .previous-search").innerText = ""

  let formattedLoc, formattedClass;
  if(location.includes("+")){
      formattedLoc = location.split("+").map(word => formatLocation(word)).join(" ");
      formattedClass = formattedLoc.split(' ').join('');
  }else{
      formattedLoc = formatLocation(location);
  }

  let doesLinkExist = document.querySelector(`.${formattedClass || location}`);
  if(doesLinkExist){
    doesLinkExist.remove();
  }

  const weather = locationData.current_condition[0].FeelsLikeF;
  const ul = document.querySelector("#previous-search-block ul");
  const li = document.createElement("li");
  li.setAttribute("class", `${formattedClass || location}`);

  //need to make this a link
  li.innerHTML = `<a href="#">${formattedLoc}</a>  - ${weather}°F`
  
  //is there a way to add multiple elements to the same event listener
  li.addEventListener("click", (e)=> {
    let url = `https://wttr.in/${orgLocation}?format=j1`;
    fetch(url)
      .then((response) => response.json())
      .then((locationData) => {
        formatLocationData(locationData);
        createPreviousSearch(location, locationData);
        createForecasting(locationData);

      })
      .catch((error) => {
        console.log(error);
      });
  })
  ul.append(li)
};

const createForecasting = (locationData) => {
    let forecast = locationData.weather;
    console.log(locationData)
    document.querySelectorAll(".forecast-day").forEach(day => {
        day.remove();
    })

    const section = document.createElement("section")
    section.id = "forecast";
    document.querySelector(".display").append(section)

    let days = ["Today", "Tomorrow", "Day After Tomorrow"]

    days.forEach((day, index)=> {
        const div = document.createElement("div");
        div.classList.add("forecast-day")
        const h2 = document.createElement("h2")
        h2.innerText = day;
        const p1 = document.createElement("p")
        p1.innerText = `Average Temperature: ${forecast[index].avgtempF}°F`
        const p2 = document.createElement("p")
        p2.innerText = `Max Temperature: ${forecast[index].maxtempF}°F`
        const p3 = document.createElement("p")
        p3.innerText = `Min Temperature: ${forecast[index].mintempF}°F`

        section.append(div)
        div.append(h2)
        div.append(p1)
        div.append(p2)
        div.append(p3)
        
    })
}
