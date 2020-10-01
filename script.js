// ==UserScript==
// @name         E-Learn clickable links
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Changes elearn due dates into clickable "add to google calendar" links
// @author       Elijah Cunningham
// @match        https://elearn.tntech.edu/d2l/lms/dropbox/user/folders_list*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    //This script works as of 30/9/20
    //It may begin to fail should elearn recieve an overhaul

    //Get page title
    let nameOfClass = document.querySelector(".d2l-navigation-s-link").title.split("-").pop().slice(1);
    console.log(nameOfClass);

    //Process assginments
    let assignments = Array.from(document.querySelectorAll("tr")); //Get all table rows
 
    //remove all category rows
    assignments.shift(); //Removes the header row
    assignments.pop(); //Removes the footer row

    assignments = assignments.filter(e=>{

        return !(e.classList.contains("d_dbold")||e.classList.contains("d_gactr")||e.classList.contains("dcs_r"));

    });

    //Template used to build our links
    let baseAddress = "http://www.google.com/calendar/event?action=TEMPLATE";

    //Iterate over each assignemnt
    assignments.forEach(a=>{

        let nameElement = a.firstChild.firstChild.firstChild;
        let dateElement = a.lastChild.firstChild.firstChild;

        if (!dateElement)
            return;

        let assignmentName = nameElement.textContent;

        let dateText = dateElement.textContent;
        let date = new Date(dateText);

        //Gets an iso string from the date and removes the following special characters: - : . ,
        //This could be done with regex, but it's far more readable this way
        let dateString = date.toISOString().replace('-','').replace(':','').replace('.','').replace(',',"");

        //Create google calendar link
        let link = baseAddress;
        link+= "&text=" + encodeURIComponent(nameOfClass + " - " + assignmentName);
        link+= "&dates=" + encodeURIComponent(dateString)+'/'+encodeURIComponent(dateString);


        //Clear dateElement, behaves weirdly if removed outright
        dateElement.textContent = "";

        //Create and substitute our clickable date
        let linkElement = document.createElement('a');
        linkElement.textContent = dateText;
        linkElement.href = link;

        dateElement.parentElement.appendChild(linkElement);

    });
})();
