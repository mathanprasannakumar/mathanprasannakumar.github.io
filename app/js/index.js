



// toggle mode for menu logic

const bar= document.querySelector(".navbox__bar");
const navbox= document.querySelector(".navbox");

function showmenu(e)
{
   if(navbox.classList.contains("open-navbox"))
   {
    // for closing the menu if it already opened
    navbox.classList.remove("open-navbox");
    bar.querySelector("a").innerHTML="<i class='fas fa-bars'></i>";
   }
   else
   {
    //for opening the menu bar is clicked 
    navbox.classList.add("open-navbox");
    bar.querySelector("a").innerHTML="<i class='fas fa-times-circle fa-lg'></i>";
   }
}



// adding a event listener for the togglebar
bar.addEventListener('click',showmenu);
bar.addEventListener('keypress',showmenu);


