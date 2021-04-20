
var clientId = 'ca4d5ad864504f63a0faea1b58eb617c'
var clientSecret ='2b0330b99dab42f4b3a969c828dcf6cc'
var redirect_uri ='http://localhost:5500/'
var authUrl ='https://accounts.spotify.com/authorize'

var access_token = null;
var refresh_token = null;
var currentPlaylist = "";
var radioButtons = [];
const TOKEN = "https://accounts.spotify.com/api/token";
const PLAYLISTS = "https://api.spotify.com/v1/users/wizzler/playlists";



function reqAuth(){
   

    let url = authUrl;
    url += "?client_id=" + clientId;
    url += "&response_type=code";
    url += "&redirect_uri=" + encodeURI(redirect_uri);
    url += "&show_dialog=true";
    url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
    window.location.href = url; 
}


function handleRedirect(){
    let code = getCode();
    fetchAccessToken( code );
    window.history.pushState("", "", redirect_uri); 
}


function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    return code;

}

function fetchAccessToken( code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    callAuthorizationApi(body);
}
function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + clientId;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
            console.log(access_token)
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
            console.log(refresh_token)
        }
        onPageLoad();
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}

function onPageLoad(){
    client_id = localStorage.getItem('clientId');
    client_secret = localStorage.getItem('clientSecret');
    console.log(window.location.search.length)
    if ( window.location.search.length > 0 ){
        handleRedirect();
    }
    else{

        access_token = localStorage.getItem("access_token");
        console.log(access_token)
        if ( access_token == null ){
            
            document.getElementById("main").style.display = 'block';
            document.getElementById("main").innerHTML = 'we cracked the access token' 
        }
        else {
            
            // document.getElementById("deviceSection").style.display = 'block';  
           
            refreshPlaylists();
            
        }
    }
    
}

function callApi(method, url, body, callback){
    let xhr = new XMLHttpRequest();
    xhr.open(method, url, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', 'Bearer ' + access_token);
    xhr.send(body);
    xhr.onload = callback;
}
function refreshPlaylists(){
    callApi( "GET", PLAYLISTS, null, handlePlaylistsResponse );
}

function handlePlaylistsResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        removeAllItems( "playlists" );
        document.getElementsByClassName('container').innerHTML =''
        let node = document.getElementById('playlists');
        node.innerHTML =`
        <div class='row'><div class ='col-12'><h1>Spotify Playlist</h1></div></div>
        <div class='row'>
        <div class='col-md-3 mt-4'>
            <div class="card" >
                <img src=${data.items[0].images[1].url} class="card-img-top" alt="image not found">
                <div class="card-body">
                    <h5 class="card-title"> ${data.items[0].name + " (" + data.items[0].tracks.total + ")"}</h5>
                </div>
             </div>
        </div>
        <div class='col-md-3 mt-4 '> 
            <div class="card" ">
                <img src=${data.items[2].images[1].url} class="card-img-top" alt="...">
                <div class="card-body">
                    <h5 class="card-title"> ${data.items[2].name + " (" + data.items[2].tracks.total + ")"}</h5>
                </div>
            </div>
        </div>
        <div class='col-md-3 mt-4 '> 
        <div class="card" ">
            <img src=${data.items[3].images[1].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[3].name + " (" + data.items[3].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[4].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[4].name + " (" + data.items[4].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[5].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[5].name + " (" + data.items[5].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[6].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[6].name + " (" + data.items[6].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[7].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[7].name + " (" + data.items[7].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[8].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[8].name + " (" + data.items[8].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[9].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[9].name + " (" + data.items[9].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    <div class='col-md-3 mt-4'> 
        <div class="card" ">
            <img src=${data.items[10].images[0].url} class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title"> ${data.items[10].name + " (" + data.items[10].tracks.total + ")"}</h5>
            </div>
        </div>
    </div>
    </div>`

        


        document.getElementById('playlists').value=currentPlaylist;
    }
    else if ( this.status == 401 ){
        refreshAccessToken()
    }
    else {
        console.log(this.responseText);
        alert(this.responseText);
    }
}



function removeAllItems( elementId ){
    let node = document.getElementById(elementId);
    while (node.firstChild) {
        node.removeChild(node.firstChild);
    }
}
