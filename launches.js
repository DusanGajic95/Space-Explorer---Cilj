document.addEventListener("DOMContentLoaded",async function () {
   await  displayRocketDetails("5eb87cddffd86e000604b32f")
  
  
   console.log("sdan") 
  
  });
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
  
  async function displayRocketDetails(rocketId) {
   
    const rocketData = await fetchRocketDetails(rocketId);
  
    const detailsWindow = document.getElementById("details")
    detailsWindow.innerHTML = `
        <h2>${rocketData.name}</h2>
        <p>Type: ${rocketData.type}</p>
        <p>Height: ${rocketData.height.meters} meters</p>
        <p>Mass: ${rocketData.mass.kg} kg</p>
        <img src="${rocketData.flickr_images[0] || 'https://via.placeholder.com/150'}" alt="Rocket Image">
    `; 
    
  }