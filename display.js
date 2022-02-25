// Link to dataset of album information hosted online
// Dataset taken from: https://www.kaggle.com/abhijithchandradas/rate-your-music-top-albums
var dataUrl = 'https://api.npoint.io/8572e8c1991694ef603f'

// Fetch data hosted online using a GET request
async function getData() {
    var data = await fetch(dataUrl);
    update_elements([await data.json()]);
}

// Create a new HTTP object (to)
const Http = new XMLHttpRequest()

// Insert data from the dataset into the webpage
function update_elements(data) {
    // Choose a random element (0-1999) from the dataset JSON
    data = data[0][Math.floor(Math.random() * 2000)]

    // These keys can be used to update the elements on the webpage (ID) and index specific data from the dataset (JSON keys)
    keys = ["album_name", "artist", "releasedate", "avg_rating", "total_rating", "pr_genres", "tags"]

    // Variable used to count # of loops
    i = 0

    // While the last element has not yet been updated...
    while (i < keys.length) {
        // If we are about to update the tags or genres element...
        if (keys[i] == "tags" || keys[i] == "pr_genres") {

            // Split the tags by their commas
            tagsSplit = data[keys[i]].split(',')
            firstTag = tagsSplit[1]
            secondTag = tagsSplit[2]

            // If there is only one genre/tag, do not try and display two (will show undefined)
            if (secondTag == undefined) {
                document.getElementById(keys[i]).innerHTML += data[keys[i]]
                    // If the second tag/genre is not undefined (exists)
            } else {
                document.getElementById(keys[i]).innerHTML += firstTag + ", " + secondTag
            }

            // If we are updating the album name...
        } else if (keys[i] == "album_name") {
            // If the name is longer than 32 characters
            if (data[keys[i]].length > 32) {
                // Split the list onto a newline (after 32 characters)
                albumName = data[0][keys[i]].substring(0, 32) + "\n" + data[keys[i]].substring(32, data[keys[i]].length - 1)
                document.getElementById(keys[i]).innerHTML += albumName
                    // If the name is not over 32 characters, treat it normally
            } else {
                document.getElementById(keys[i]).innerHTML += data[keys[i]];
            }
            // If not updating album name or tags, treat normally
        } else {
            document.getElementById(keys[i]).innerHTML += data[keys[i]];
        }
        i++
    }
    // Call loadArtist albums with the artist name and album name as parameters (to find album artwork)
    loadAlbumArtwork(data['artist'], data['album_name'])
}

function loadAlbumArtwork(artistName, albumTitle) {
    // Replace spaces with "+" in name
    if (artistName.includes(" ") == true) {
        artistName = artistName.replaceAll(" ", "+")
        console.log(artistName)
    }

    // Replace spaces with "+" in album name
    if (albumTitle.includes(" ") == true) {
        albumTitle = albumTitle.replaceAll(" ", "+")
    }

    // Prepare discogs API link with the newly changed album name and artist name
    releasesLink = "https://api.discogs.com/database/search?type=master&artist=" + artistName + "&release_title=" + albumTitle + "&key=HYuuGtlbGNTyiZhOVtvr&secret=phSfqgJKQQsAPjQXKVNCtlztycxPvhHz"

    // Send a GET request to the link above
    Http.open("GET", releasesLink)
    Http.send()

    Http.onreadystatechange = (e) => {
        // Receive the album listing data
        data = Http.responseText
            // Turn the data into a JSON file (so that specific information can be called using keys)
        var JSONdata = JSON.parse(data)

        // Find link to the cover image
        link = JSONdata['results'][0]['cover_image']
            // Update the webpage with the album artwork
        document.getElementById("album-cover").src = link
    }
}

// Call the getData function when the page first loads (automatically)
getData()