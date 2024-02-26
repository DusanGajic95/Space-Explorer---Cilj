
  async function fetchData(endpoint) {
    try {
        const response = await fetch(endpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
  }
  
  async function fetchRocketDetails(rocketId) {
    const rocketEndpoint = `https://api.spacexdata.com/v4/rockets/${rocketId}`;
    try {
        const response = await fetch(rocketEndpoint);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching rocket details:", error);
    }
 } 
 
  
  function navigateTo(section) {
    const sections = [ "launches", "rockets", "company"];
    sections.forEach(s => {
        const element = document.getElementById(s);
        element.style.display = (s === section) ? "block" : "none";
    });
  
    const backButton = document.querySelector('button');
    backButton.style.display = (section === 'home') ? 'none' : 'block';
  
    if (section === "launches") {
        displayLaunches();
    } else if (section === "rockets") {
        displayRockets();
    } else if (section === "company") {
        displayAboutUs();
    }
  }
  
  async function navigateBack() {
    const currentSection = document.querySelector('section[style="display: block;"]');
    const currentSectionId = currentSection.getAttribute('id');
  
    if (currentSectionId === 'launches' || currentSectionId === 'rockets' || currentSectionId === 'company') {
        navigateTo('home');
    }
  }
  
  async function displayAboutUs() {
    const aboutSection = document.getElementById("company");
    if(aboutSection){

      aboutSection.innerHTML = ""; 
      
      
      const aboutEndpoint = "https://api.spacexdata.com/v4/company";
      const aboutData = await fetchData(aboutEndpoint);
      
      
      
        const aboutInfo = document.createElement("div")
        aboutInfo.innerHTML = `
        <h2>${await aboutData.name}</h2>
        <p>Osnivac: ${ await aboutData.founder}</p>
        <p>Sediste: ${ await aboutData.headquarters.address}</p>
        <p>Grad: ${ await aboutData.headquarters.city}</p>
        <p>Drzava: ${ await aboutData.headquarters.state}</p> 
        <p>Godina osnivanja: ${await aboutData.founded}</p>
        <p>Opis: ${await aboutData.summary}</p>

        `
        aboutSection.appendChild(aboutInfo)
        
        
      
    }
    
  }
  
  async function displayHome() {
    const homeSection = document.getElementById("home");
    homeSection.style.display = "block";
  
    const rocketImagesContainer = document.getElementById("rocketImages");
    rocketImagesContainer.innerHTML = ""; 
  
    
    
  
    rocketImageURLs.forEach(url => {
        const rocketImage = document.createElement("img");
        rocketImage.src = url;
        rocketImage.alt = "Rocket Image";
        rocketImagesContainer.appendChild(rocketImage);
    });
  }
  
  async function displayLaunches() {
    const launchesSection = document.getElementById("launches");
    if (launchesSection){
        
        launchesSection.innerHTML = ""; 
        
        
        const launchesEndpoint = "https://api.spacexdata.com/v4/launches";
        const launchesData = await fetchData(launchesEndpoint);
        
        launchesData.forEach((launch) => {
            const launchInfo = document.createElement("div");
            launchInfo.innerHTML = `
            <h2>${launch.name}</h2>
            <p>Date: ${launch.date_utc}</p>
            <p>Mission: ${launch.mission_name}</p>
            <p>Success: ${launch.success ? 'Yes' : 'No'}</p>
            <img src="${launch.links.patch.small || 'https://via.placeholder.com/150'}" alt="Rocket Image">
            <a href="#" onclick="displayRocketDetails('${launch.rocket}')">Details</a>
            `;
            launchesSection.appendChild(launchInfo);
        });
        
        
    }
  }
  
  async function displayRockets() {
    const rocketsSection = document.getElementById("rockets");
    rocketsSection.innerHTML = ""; 
  
    
    const rocketsEndpoint = "https://api.spacexdata.com/v4/rockets";
    const rocketsData = await fetchData(rocketsEndpoint);
  
    rocketsData.forEach((rocket) => {
        const rocketInfo = document.createElement("div");
        rocketInfo.innerHTML = `
            <h2>${rocket.name}</h2>
            <p>Type: ${rocket.type}</p>
            <p>Height: ${rocket.height.meters} meters</p>
            <p>Mass: ${rocket.mass.kg} kg</p>
            <img id="rocketImg" src="${rocket.flickr_images[0] || 'https://via.placeholder.com/150'}" alt="Rocket Image">
            <a href="detail.html?id=${rocket.id}">Details</a>
        `;
        rocketsSection.appendChild(rocketInfo);
    });
  
    rocketsSection.style.display = "block";
  }
  
  async function displayRocketDetails() {

    const itemId = new URLSearchParams(window.location.search).get('id');
    
    const rocketData = await fetchRocketDetails(itemId);
    
    
    document.getElementById('title').innerText = rocketData.name
    document.getElementById('tip').innerText = rocketData.type
    document.getElementById('height').innerText = rocketData.height.meters + 'm'
    document.getElementById('mass').innerText = rocketData.mass.kg + 'kg'
    document.getElementById('description').innerText = rocketData.description
    
    getSlider(rocketData.flickr_images)

  }
   function getSlider (photoList) {
    const sliderElement = document.getElementById("slider");
    
    photoList.forEach((photoPath) => {
        const imgElement = document.createElement("img");
        imgElement.src = photoPath;
        sliderElement.appendChild(imgElement);
        imgElement.setAttribute("class", "sliderImg")
    });

    const slides = document.getElementsByClassName("sliderImg");
    let currentSlideIndex = 0;
    

    function showSlide(index) {
        for (let i = 0; i < slides.length; i++) {
            slides[i].style.outline = "";
        }
        slides[index].style.outline = "1px black solid";
        document.getElementById('img').src = photoList[index] 
    }

    showSlide(currentSlideIndex);

    document.getElementById("sledecaSlika").addEventListener("click", function () {
        currentSlideIndex = (currentSlideIndex + 1) % slides.length;
        showSlide(currentSlideIndex);
    });

    document.getElementById("prethodnaSlika").addEventListener("click", function () {
        currentSlideIndex = (currentSlideIndex - 1 + slides.length) % slides.length;
        showSlide(currentSlideIndex);
    });
    
}



 