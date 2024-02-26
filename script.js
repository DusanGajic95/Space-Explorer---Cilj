
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
    aboutSection.innerHTML = ""; 
    
    
    const aboutEndpoint = "https://api.spacexdata.com/v4/company";
    const aboutData = await fetchData(aboutEndpoint);
  
    
    aboutSection.innerHTML = `
        <h2>About Us</h2>
        <p>${aboutData.summary}</p>
    `;
  
    aboutSection.style.display = "block";
  }
  
  async function displayHome() {
    const homeSection = document.getElementById("home");
    homeSection.style.display = "block";
  
    const rocketImagesContainer = document.getElementById("rocketImages");
    rocketImagesContainer.innerHTML = ""; 
  
    
    const rocketImageURLs = [
        "img1.jpg"
        
        
    ];
  
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
            <a href="detail.html">Details</a>
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
    console.log(itemId)
    const rocketData = await fetchRocketDetails(itemId);
    
    console.log(rocketData)
    document.getElementById('title').innerText = rocketData.name
    document.getElementById('tip').innerText = rocketData.type
    document.getElementById('height').innerText = rocketData.height.meters + 'm'
    document.getElementById('mass').innerText = rocketData.mass.kg + 'kg'
    document.getElementById('description').innerText = rocketData.description
    document.getElementById('img').src = rocketData.flickr_images[0]

  }
 