'use strict';

// prettier-ignore
// const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');


// let map,mapEvent;
class Workout{
    date;id;
    date=new Date();
    id=(Date.now()+" ").slice(-10);
    constructor(coords,distance,duration){
        this.coords=coords;
        this.duration=duration;
        this.distance=distance;

    };
    _setDescription(){
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        this.description=`${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()} `;
    }
};
// const workout=new Workout();
// console.log(workout.id);
class Running extends Workout{
    type="running";
    constructor(coords,distance,duration,cadence){
        super(coords,distance,duration);
        this.cadence=cadence;
        this.calcpace();
        this._setDescription();
    }

    calcpace(){
        this.pace=this.duration/this.distance;
        return this.pace;
    }
};
class Cycling extends Workout{
    type="cycling";
    constructor(coords,distance,duration,elevation){
        super(coords,distance,duration);
        this.elevation=elevation;
        this.calcspeed();
        this._setDescription();
    }
    calcspeed(){
        this.speed=this.distance/(this.duration/60);
        return this.speed;
    }
}
// const run1=new Running();
// const cycle1=new Cycling();
// console.log(run1,cycle1);
// console.log(workout.id);
class app{
    #map;
    #mapEvent;
    #workouts=[];
constructor(){
this._getPosition();
this._getLocalStorage();
form.addEventListener("submit",this._newWorkout.bind(this));

containerWorkouts.addEventListener("click",this._movePopUp.bind(this));

inputType.addEventListener("change",this._toggleElevationField)


};
_getPosition(){
    if(navigator.geolocation)
    navigator.geolocation.getCurrentPosition(this._loadMap.bind(this),
    function(){
    alert("will show Errror");
    })};
_loadMap(position){    
    
    const latitude=position.coords.latitude;
    const {longitude}=position.coords;
    // console.log(latitude,longitude);
    // console.log(`https://www.google.com/maps/@${latitude},${longitude}`)
     this.#map = L.map('map').setView([latitude, longitude], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.#map);
    
    // L.marker([latitude, longitude]).addTo(map)
    //     .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    //     .openPopup();
    this.#map.on("click",this._showForm.bind(this)
        // console.log(m);

        // const{lat,lng}=m.latlng;
        // L.marker([lat, lng]).addTo(this.#map)
        // .bindPopup(
        //     L.popup({
        //         maxWidth:250,
        //         minWidth:100,
        //         autoClose:false,
        //         closeOnClick:false,
        //         className:"running-popup",
        //     })
        // ).setPopupContent("workout")
        // .openPopup();
)
this.#workouts.forEach(w=>{
    // this.renderWorkout(w);
    this.refactorMarker(w);
})
    };
_showForm(m){
    this.#mapEvent=m;
    form.classList.remove("hidden");
    inputDistance.focus();
};
_hideForm(){
    inputCadence.value=inputElevation.value=inputDuration.value=inputElevation.value=" ";
    form.style.display="none";
    form.classList.add("hidden");
    setTimeout(()=>form.style.display="grid",1000);
};
_toggleElevationField(){
    inputElevation.closest(".form__row").classList.toggle("form__row--hidden");
    inputCadence.closest(".form__row").classList.toggle("form__row--hidden");
};
// const inputType = document.querySelector('.form__input--type');
// const inputDistance = document.querySelector('.form__input--distance');
// const inputDuration = document.querySelector('.form__input--duration');
// const inputCadence = document.querySelector('.form__input--cadence');
// const inputElevation = document.querySelector('.form__input--elevation');
_newWorkout(e){
    e.preventDefault();
    // form.classList.add("hidden");
    const valid=(...input)=>input.every(inp=>Number.isFinite(inp));
    const postive=(...input)=>input.every(inp=>inp>0);
    // console.log("click");
    const input= inputType.value;
    const distance= +inputDistance.value;
    const duration= +inputDuration.value;
    const{lat,lng}=this.#mapEvent.latlng;
    let workout;

    if(input==="running"){
        const cadence=+inputCadence.value;
    //   if(!Number.isFinite(distance)||!Number.isFinite(duration)||!Number.isFinite(cadence)){
    if(!valid(distance,cadence,duration)||!postive(distance,cadence,duration)){      
    return alert("Wrong Credentials");
      } 
        workout=new Running([lat,lng],distance,duration,cadence); 
        // this.#workouts.push(workout);
    };
    if(input==="cycling"){
        const elevation= +inputElevation.value;
    //   if(!Number.isFinite(distance)||!Number.isFinite(duration)||!Number.isFinite(cadence)){
    if(!valid(distance,elevation,duration)||!postive(distance,elevation,duration))     
     return alert("Wrong Credentials");
    //  return;    ----------------------------------
    //  return;   
      
      workout=new Cycling([lat,lng],distance,duration,elevation);
    //   this.#workouts.push(workout);  

};

    this.#workouts.push(workout);
    // console.log(workout);
// clear fields
// inputCadence.value=inputElevation.value=inputDuration.value=inputElevation.value=" ";
    // const{lat,lng}=this.#mapEvent.latlng;
    this.refactorMarker(workout);
     this.renderWorkout(workout); 
     this._hideForm();  
     this._setLocalstorage();
    };
refactorMarker(workout){
    L.marker(workout.coords).addTo(this.#map)
    .bindPopup(
        L.popup({
            maxWidth:250,
            minWidth:100,
            autoClose:false,
            closeOnClick:false,
            className:`${workout.type}-popup`,
        })
    ).setPopupContent(`${workout.type==="running"?"🏃‍♂️":":)"} ${workout.description}`)
    .openPopup();
}
renderWorkout(workout){
     let html=`<li class="workout workout--${workout.type}" data-id="${workout.id}">
     <h2 class="workout__title">${workout.description}</h2>
     <div class="workout__details">
       <span class="workout__icon">${workout.type==="running"?"🏃‍♂️":":)"}</span>
       <span class="workout__value">${workout.distance}</span>
       <span class="workout__unit">km</span>
     </div>
     <div class="workout__details">
       <span class="workout__icon">⏱</span>
       <span class="workout__value">${workout.duration}</span>
       <span class="workout__unit">min</span>
     </div>`;
     if(workout.type==="running"){
         html += `<div class="workout__details">
         <span class="workout__icon">⚡️</span>
         <span class="workout__value">${workout.pace}</span>
         <span class="workout__unit">min/km</span>
       </div>
       <div class="workout__details">
         <span class="workout__icon">🦶🏼</span>
         <span class="workout__value">${workout.cadence}</span>
         <span class="workout__unit">spm</span>
       </div>
       </li> -->`
     };
    if(workout.type==="cycling"){
        html +=`<div class="workout__details">
        <span class="workout__icon">⚡️</span>
        <span class="workout__value">${workout.speed.toFixed(1)}</span>
        <span class="workout__unit">km/h</span>
      </div>
      <div class="workout__details">
        <span class="workout__icon">⛰</span>
        <span class="workout__value">${workout.elevation}</span>
        <span class="workout__unit">m</span>
      </div>
    </li> -->`;
    };
    form.insertAdjacentHTML("afterend",html); 
 };
_movePopUp(e){
    const workoutel=e.target.closest(".workout");
    console.log(workoutel);
    if(!workoutel) return;
const workout=this.#workouts.find(e=>e.id===workoutel.dataset.id);
console.log(workout);

this.#map.setView(workout.coords,13,{
    animate:true,
    pan:{
        duration:1
    },
});

}; 
_setLocalstorage(){
    localStorage.setItem("workout",JSON.stringify(this.#workouts));
}; 
_getLocalStorage(){
    const data=JSON.parse(localStorage.getItem("workout"));
    console.log(data);
if(!data) return;
this.#workouts=data;

this.#workouts.forEach(w=>{
    this.renderWorkout(w);
    // this.refactorMarker(w);
})

};
reset(){
    localStorage.removeItem("workout");
    location.reload();
}
};
const demo=new app;
// demo._getPosition();


// inputCadence.value=inputElevation.value=inputDuration.value=inputElevation.value=" ";


