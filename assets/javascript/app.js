$(document).ready(() => {
    const APIKEY = "XXnx6cAouQAfVqH4QVc3LQkiVxKequ07";
    const APIURL = "https://api.giphy.com/v1/gifs/";
    const DEFAULTLIMIT = 10;
    var LASTCLICKED = null;
    const TOPICS = [
        "cats", "dogs", "seals", "birds"
    ];

    var topicsSection = $(".topics-section");
    var gifsSection = $(".gifs-section");
    var searchSection = $(".search-section");
    var addTitle = $(".add-title");

    /**
     * Display all titles in TOPICS to top of page as buttons.
     * @param {String[]} array 
     */
    function displayTitles(array) {
        topicsSection.empty();
        array.forEach(element => {
            topicsSection.append(`<button type="button" class="title btn btn-outline-primary">${element}</button>`);
        });
    }

    /**
     * Take in a JSON Object received from API and display gifs in Object.
     * @param {JSON} obj 
     */
    function displayGifs(obj) {
        console.log(obj);
        let dataSet = obj.data;
        dataSet.forEach(element => {
            let stillimgUrl = element.images.fixed_height_still.url;
            let activeimgUrl = element.images.fixed_height.url;
            let rating = element.rating;

            let card = $("<div>");
            card.addClass("gif card");
            card.attr("id", element.id);
            card.attr("data-still", "true");
            card.append(`<div class="card-body p-2"><h6 class="card-text">rating: ${rating}</h6></div>`);
            card.append(`<img class="card-img-bottom" src="${stillimgUrl}" alt="${activeimgUrl}">`);
            gifsSection.append(card);
        });
    }

    /**
     * Using Giphy API to search for title and return JSON Obj
     * @param {String} title
     */
    function searchTitle(title) {
        console.log(`${APIURL}search?api_key=${APIKEY}&q=${title.replace(/\s/g, '+')}&limit=${DEFAULTLIMIT}`);
        $.ajax({
            url : `${APIURL}search?api_key=${APIKEY}&q=${title.replace(/\s/g, '+')}&limit=${DEFAULTLIMIT}`,
            method : "GET",
        }).then(function(response) {
            console.log("response is ");
            console.log(response);
            displayGifs(response);
        });
    }

    
    $(document).on("click", ".title", function() {
        let title = $(this).text();
        $(this).addClass("active");
        if (LASTCLICKED) {
            LASTCLICKED.removeClass("active");
        };
        LASTCLICKED = $(this);
        gifsSection.empty();
        searchTitle(title);
        
    });

    $(".add-title").on("click", function(event) {
        event.preventDefault();
        var title = $(".title-input").val().trim();
        if (title && !TOPICS.includes(title)) {
            TOPICS.push(title);
            displayTitles(TOPICS);
        }
        $(".title-input").val("");
    });

    $(document).on("click", ".card", function() {
        // http://api.giphy.com/v1/gifs/feqkVgjJpYtjy?api_key=YOUR_API_KEY
        let id = $(this).attr("id");
        console.log(id);
        let currCard = $(this);
        // var queryUrl = `http://api.giphy.com/v1/gifs/${id}?api_key=${APIKEY}`;
        // $.ajax({
        //     url : queryUrl,
        //     method : "GET",
        // }).then(function(response) {
        //     console.log(response);
        //     if (currCard.data("still") === "true") {
        //         currCard.find("img").attr("src", response.data.images.fixed_height.url);
        //         currCard.data("still", "false");
        //     } else {
        //         currCard.find("img").attr("src", response.data.images.fixed_height_still.url);
        //         currCard.data("still", "true");
        //     }
        // });
        let currSrc = currCard.find("img").attr("src");
        let currAlt = currCard.find("img").attr("alt");

        currCard.find("img").attr("src", currAlt);
        currCard.find("img").attr("alt", currSrc);
    });

    displayTitles(TOPICS);;
});
