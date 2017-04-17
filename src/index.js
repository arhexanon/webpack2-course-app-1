/**
 * Created by arhexanon on 14-4-17.
 */
import sum from "./sum";

console.log(sum(948,9));


const button = document.createElement("button");
button.innerText = "Click me";

button.onclick = () => {
    //Code splitting... 
    System.import("./image_viewer").then( module => {
       console.log(module);
       module.default();
    });

};

document.body.appendChild(button);


