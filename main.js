const btn = document.getElementById("btn");
const content = document.querySelector("main");


function linkShortener() {
   const url = document.getElementById("url-link").value;
   const api = `https://api.shrtco.de/v2/shorten?url=${url}`;

   // Check if the input text is empty
   if(url == "") {
      const p = document.querySelector(".error-message");
      p.classList.add("active");
      // Remove class active on animation end
      p.addEventListener("animationend", e => e.target.classList.remove("active"));
   } else {
      // Create elements to put the data received
      const div = document.createElement("div");
      const original = document.createElement("span");
      const short = document.createElement("span");
      const copy = document.createElement("button");

      // Add class to element
      div.className = "result-wrapper";
      copy.className = "copy";

      // Add elements to the DOM
      div.appendChild(original);
      div.appendChild(short);
      div.appendChild(copy);
      content.insertAdjacentElement("afterbegin", div);

      // Get the data from the endpoint
      fetch(api)
         .then(response => response.json())
         .then(data => {
            short.textContent = data["result"]["short_link"];
            original.textContent = data["result"]["original_link"];
            copy.textContent = "copy";
         })
         .then(() => {
            // Put the links into an object
            const previousLinks = {
               fullLink: document.querySelector("main > .result-wrapper > span:first-Child").textContent,
               shortOne: document.querySelector("main > .result-wrapper > span:nth-child(2)").textContent
            };
            // Store the links into local storage
            localStorage.setItem("links", JSON.stringify(previousLinks));
         })
         .catch(err => {
            div.textContent = "Invalid Link or No Internet";
         });

      // Create function to copy link to the clip-board
      function copyLink(e) {
         const shortLink = document.querySelector("main > .result-wrapper > span:nth-child(2)");
         const text = document.createElement("textarea");
         text.setAttribute("readonly", "");
         // I put the shortlink value into the textarea in order to use the select() method on textarea/input element
         text.value = shortLink.textContent;
         document.body.appendChild(text);
         // Copy the shortened link to the clipboard
         text.select();
         document.execCommand("copy");
         // Change text of button and background color when clicked
         this.style.backgroundColor = "hsl(257, 27%, 26%)";
         this.textContent = "copied!";
         document.body.removeChild(text);
      }
      copy.addEventListener("click", copyLink);
   }
}

btn.addEventListener("click", linkShortener);


/* Store the shortened links into local storage */
const retrieveLinks = () => {
   const div = document.createElement("div");
   div.className = "result-wrapper";
   content.insertAdjacentElement("afterbegin", div);
   // Check if links are stored local storage
   if(localStorage.getItem("links")) {
      // Convert the links back to object then destructure them
      let {fullLink, shortOne} = JSON.parse(localStorage.getItem("links"));
      div.innerHTML = `<span>${fullLink}</span><span>${shortOne}</span>`;
   } else {
      div.textContent = "you have no previous shortened links";
   } 
};

window.addEventListener("load", retrieveLinks);






