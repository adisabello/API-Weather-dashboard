async function fetchWeather(){
    let city = document.getElementById("city").value;
    let key = 'dfd4fc193c8f9502c6db77512ad1a571';
    let loc = await getLocation(city, key);

    let url = 'http://api.openweathermap.org/data/2.5/onecall?lat='+loc.lat+'&lon='+loc.lon+'&appid='+key+'&units=metric&lang=en';

    fetch(url)
    .then(resp=>{
        if(!resp.ok) throw new Error(resp.statusText);
        return resp.json()
    })
    .then(resp=>{
        saveData(city, resp);
        showData(city, resp);
    })
    .catch(err => console.log(err))
}

function saveData(city, data){
    let saved = localStorage.getItem("saved");
    if(saved){
        saved = JSON.parse(saved);
    }else{
        saved = [];
    }
    let exists = false;
    for( let i = 0; i < saved.length; i++){
        if(saved[i].city == city){
            exists = true;
            break;
        }
    }
    if(!exists){
        saved.push({city: city, data: data});
        localStorage.setItem("saved",JSON.stringify(saved));
    }
    listSaved();
}

async function getLocation(city, key){
    let url = 'http://api.openweathermap.org/data/2.5/weather?q='+city+'&appid='+key;
    let resp = await fetch(url);
    resp = await resp.json();

    loc = resp.coord;
    return loc;
}

function loadData(city){
    let saved = localStorage.getItem("saved");
    if(saved)
        saved = JSON.parse(saved);
    for( let i = 0; i < saved.length; i++){
        if(saved[i].city == city){
            showData(city, saved[i].data);
        }
    }
}

function showData(name, data){
    let daily = data.daily;
    let day = daily[0];
    let dayDate = new Date(day.dt*1000);
    let temp = day.temp.day * 1.8 + 32;
    document.getElementById("name").innerHTML = name+" ("+(dayDate.getMonth()+1)+"/"+dayDate.getDay()+"/"+dayDate.getFullYear()+")";
    document.getElementById("temp").innerHTML = "Temp: "+temp+"°F";
    document.getElementById("wind").innerHTML = "Wind: "+day.wind_speed +"MPH";
    document.getElementById("humidity").innerHTML =  "Humidity: "+day.humidity+" %";
    document.getElementById("uv").innerHTML = ""+day.uvi;
    if(day.uvi < 3)
        document.getElementById("uv").style.backgroundColor = "green"
    else if(day.uvi < 5)
        document.getElementById("uv").style.backgroundColor = "orange"
    else
        document.getElementById("uv").style.backgroundColor = "red"

    let info = ``;
    for(let i = 1; i < 6; i++){
        day = daily[i];
        dayDate = new Date(day.dt*1000);
        temp = day.temp.day * 1.8 + 32;
        info+=`<div class="day">
                    <h3>${(dayDate.getMonth()+1)+"/"+dayDate.getDay()+"/"+dayDate.getFullYear()}</h3>
                    <p><img src='http://openweathermap.org/img/wn/${day.weather[0].icon}.png' /></p>
                    <p>Temp: ${temp}°F</p>
                    <p>Wind: ${day.wind_speed} MPH</p>
                    <p>Humidity: ${day.humidity} %</p>
                </div>`
    }

    document.getElementById("days").innerHTML = info;
}

function listSaved(){
    let saved = localStorage.getItem("saved");
    if(saved){
        saved = JSON.parse(saved);
    }else{
        return;
    }
    let data = ``;
    for( let i = 0; i < saved.length; i++){
        data+=`<button class="history" onclick="loadData('${saved[i].city}')">${saved[i].city}</button>`;
    }
    document.getElementById("history").innerHTML = data;
}

listSaved();