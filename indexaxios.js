// import * as Carousel from "./Carousel.js";
import { data } from 'jquery';
import { createCarouselItem, clear, appendCarousel, start } from './Carousel.js';
import axios from "axios";

// The breed selection input element.
const breedSelect = document.getElementById("breedSelect");
// The information section div element.
const infoDump = document.getElementById("infoDump");
// The progress bar div element.
const progressBar = document.getElementById("progressBar");
// The get favourites button element.
const getFavouritesBtn = document.getElementById("getFavouritesBtn");

// Step 0: Store your API key here for reference and easy access.
const API_KEY = "live_mOHUcCotszCsSkshqfvDD7BzIEpWdHxzAtpAtnafEtVW6pJaToOuym1u88Yatapm";

axios.defaults.baseURL = "https://api.thecatapi.com/v1";
axios.defaults.headers.common["x-api-key"] = API_KEY;

/**
 * 1. Create an async function "initialLoad" that does the following:
 * - Retrieve a list of breeds from the cat API using fetch().
 * - Create new <options> for each of these breeds, and append them to breedSelect.
 *  - Each option should have a value attribute equal to the id of the breed.
 *  - Each option should display text equal to the name of the breed.
 * This function should execute immediately.
 */


function updateProgress(event) {
  if (event.lengthComputable) {
    const percentComplete = (event.loaded / event.total) * 100;
    progressBar.style.width = `${percentComplete}%`;
  }
  console.log('Progress event:', event); 
}

axios.interceptors.request.use(
  request => {
    request.time = {startTime: new Date()}
    console.log('Starting Request', request);
    progressBar.style.width = '0%'; // Reset progress bar
    document.body.style.cursor = "progress";
    return request;
  },
  function (error) {

    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  response => {
    const duration = new Date - response.config.time.startTime;
    console.log('Request Completed in', duration, 'ms');
    document.body.style.cursor = "default";
    progressBar.style.width = '100%';
  
    return response;
  },
  function (error) {

    return Promise.reject(error);
  }
);


async function initialLoad() {
  // // const url = `https://api.thecatapi.com/v1/breeds`;
  // const response = await fetch(url, {headers: {
  //   'x-api-key': API_KEY
  // }});
   // const breeds = await response.json();
  try{
    const response = await axios.get('/breeds', {
      onDownloadProgress: updateProgress,
    });
    const breeds = await response.data;
  
    breeds.forEach(breed => {
      const option = document.createElement("option");
      option.value = breed.id;
      option.textContent = breed.name;
      breedSelect.appendChild(option);
    });

    if(breeds.length > 0) {
      const initialBreedId = breeds[0].id;
      await handleBreedSelect(initialBreedId);
    }
  }catch(error) {
    console.error("Error Fetching breeds failed", error);
  }
} 
initialLoad();

/**
 * 2. Create an event handler for breedSelect that does the following:
 * - Retrieve information on the selected breed from the cat API using fetch().
 *  - Make sure your request is receiving multiple array items!
 *  - Check the API documentation if you're only getting a single object.
 * - For each object in the response array, create a new element for the carousel.
 *  - Append each of these new elements to the carousel.
 * - Use the other data you have been given to create an informational section within the infoDump element.
 *  - Be creative with how you create DOM elements and HTML.
 *  - Feel free to edit index.html and styles.css to suit your needs, but be careful!
 *  - Remember that functionality comes first, but user experience and design are important.
 * - Each new selection should clear, re-populate, and restart the Carousel.
 * - Add a call to this function to the end of your initialLoad function above to create the initial carousel.
 */


async function handleBreedSelect(breedId){
  // try{const breedId = e.target.value;
  // console.log(breedId);
  try{
    // progressBar.style.width = '0%'; // Reset progress bar

    // const response = await fetch(`https://api.thecatapi.com/v1/images/search?limit=5&breed_ids=${breedId}&api_key=${API_KEY}`)
    // const images = await response.json();
    const response = await axios.get(`/images/search?limit=5&breed_ids=${breedId}`, 
      {
      onDownloadProgress:updateProgress
      }
    );

    const images = await response.data;
    console.log(images);


    const mala = await axios.get(`/images/search?breed_ids=mala&limit=6;`);
    const malaData = mala.data;
    console.log(malaData);
    
    clear();

    // const carouselInner = document.getElementById("carouselInner");
    // carouselInner.innerHTML = "";
    infoDump.innerHTML = "";


    if (images.length === 0) {
      console.error("No images found for the selected breed.");
      infoDump.innerHTML = "<p>No images available for this breed.</p>";
      return;
    }

    const breed = images[0].breeds[0];
    if (!breed) {
      console.error("No breed information found.");
      infoDump.innerHTML = "<p>No breed information available.</p>";
      return;
    }

    const infoItem  = document.createElement("div");
    infoItem.innerHTML = `
    <h1>${breed.name}</h1>
    <p>${breed.description}</p>
    <p><strong>Temperament:</strong> ${images[0].breeds[0].temperament}</p>
    <p><strong>Origin:</strong> ${images[0].breeds[0].origin}</p>`;
    infoDump.appendChild(infoItem); 


    images.forEach((imgData, index) => {
      const carouselItem = createCarouselItem(imgData.url, imgData.breeds[0].name, imgData.id);
      appendCarousel(carouselItem)

    });

    start();
  }catch(error){
    console.error("Error Fetching breed info. failed", error);
  }

}
 

breedSelect.addEventListener('change', async (event) => {
  const breedId = event.target.value;
  await handleBreedSelect(breedId);
})




/**
 * 4. Change all of your fetch() functions to axios!
 * - axios has already been imported for you within index.js.
 * - If you've done everything correctly up to this point, this should be simple.
 * - If it is not simple, take a moment to re-evaluate your original code.
 * - Hint: Axios has the ability to set default headers. Use this to your advantage
 *   by setting a default header with your API key so that you do not have to
 *   send it manually with all of your requests! You can also set a default base URL!
 */
/**
 


 * 5. Add axios interceptors to log the time between request and response to the console.
 * - Hint: you already have access to code that does this!
 * - Add a console.log statement to indicate when requests begin.
 * - As an added challenge, try to do this on your own without referencing the lesson material.
 */


/**
 * 6. Next, we'll create a progress bar to indicate the request is in progress.
 * - The progressBar element has already been created for you.
 *  - You need only to modify its "width" style property to align with the request progress.
 * - In your request interceptor, set the width of the progressBar element to 0%.
 *  - This is to reset the progress with each request.
 * - Research the axios onDownloadProgress config option.
 * - Create a function "updateProgress" that receives a ProgressEvent object.
 *  - Pass this function to the axios onDownloadProgress config option in your event handler.
 * - console.log your ProgressEvent object within updateProgess, and familiarize yourself with its structure.
 *  - Update the progress of the request using the properties you are given.
 * - Note that we are not downloading a lot of data, so onDownloadProgress will likely only fire
 *   once or twice per request to this API. This is still a concept worth familiarizing yourself
 *   with for future projects.
 */



/**
 * 7. As a final element of progress indication, add the following to your axios interceptors:
 * - In your request interceptor, set the body element's cursor style to "progress."
 * - In your response interceptor, remove the progress cursor style from the body element.
 */
/**
 * 8. To practice posting data, we'll create a system to "favourite" certain images.
 * - The skeleton of this function has already been created for you.
 * - This function is used within Carousel.js to add the event listener as items are created.
 *  - This is why we use the export keyword for this function.
 * - Post to the cat API's favourites endpoint with the given ID.
 * - The API documentation gives examples of this functionality using fetch(); use Axios!
 * - Add additional logic to this function such that if the image is already favourited,
 *   you delete that favourite using the API, giving this function "toggle" functionality.
 * - You can call this function by clicking on the heart at the top right of any image.
 */

/**
 * 9. Test your favourite() function by creating a getFavourites() function.
 * - Use Axios to get all of your favourites from the cat API.
 * - Clear the carousel and display your favourites when the button is clicked.
 *  - You will have to bind this event listener to getFavouritesBtn yourself.
 *  - Hint: you already have all of the logic built for building a carousel.
 *    If that isn't in its own function, maybe it should be so you don't have to
 *    repeat yourself in this section.
 */

export async function favourite(imgId) {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;
    console.log('Favourites fetched:', favourites);
    
    const existingFavourite = favourites.find((fav) => fav.image_id === imgId);
    console.log('Existing favourite:', existingFavourite);

    if (existingFavourite) {
      await axios.delete(`/favourites/${existingFavourite.id}`);
      return false; // Indicates the item was unfavorited
    } else {
      await axios.post("/favourites", { image_id: imgId });
      console.log('lizzy')
      return true; // Indicates the item was favorited
    }
  } catch (error) {
    console.error("Error toggling favourite failed", error);
    throw error; // Rethrow the error to handle it elsewhere if needed
  }
}



async function getFavourites() {
  try {
    const response = await axios.get("/favourites");
    const favourites = response.data;
    

    clear();
    infoDump.innerHTML = "";

    favourites.forEach((fav) => {
      const carouselItem = createCarouselItem(
        fav.image.url,
        "FavouriteImage",
        fav.image_id
      );
      console.log('success');
      // const favButton = carouselItem.querySelector(".favourite-button");
      // favButton.classList.add("favorited");
      // appendCarousel(carouselItem);
      appendCarousel(carouselItem);
      console.log('success');
    });

    start();
  } catch (error) {
    console.error('Error fetching favorites:', error);
  }
}

getFavouritesBtn.addEventListener('click', getFavourites);


/**
 * 10. Test your site, thoroughly!
 * - What happens when you try to load the Malayan breed?
 *  - If this is working, good job! If not, look for the reason why and fix it!
 * - Test other breeds as well. Not every breed has the same data available, so
 *   your code should account for this.
 */


