var camera = 1;
var shading = 2;
var lighting = 1;
var dayTime = true;
var dayLight = 1.0;
var fog = 10;
var angle = 50;
var horsesChanged = false;
var simple;

const SimpleHorses = () => {
    simple = true;
    LoadHorses(simple);
    horsesChanged = true;
}

const ComplicatedHorses = () => {
    simple = false;
    LoadHorses(simple);
    horsesChanged = true;
}

const Camera = (elem) => {
    if (elem.id == "camera1") camera = 1; // nieruchoma kamera
    if (elem.id == "camera2") camera = 2; // kamera obserwujaca obiekt
    if (elem.id == "camera3") camera = 3; // ruchoma kamera
}

const Shading = (elem) => {
    if (elem.id == "shading1") shading = 1;
    if (elem.id == "shading2") shading = 2;
}

const Lighting = (elem) => {
    if (elem.id == "lighting1") lighting = 1;
    if (elem.id == "lighting2") lighting = 2;
}

const DayTime = (elem) => {
    if (elem.id == "day")
    {
        if (!dayTime) {
            dayTime = true;
            for (let i = 1.0; i < 10.0; i++) {
                setTimeout(() => { dayLight = i / 10.0; }, 100 * i);
            }
        }
    }
    if (elem.id == "night")
    {
        if (dayTime) {
            dayTime = false;
            for (let i = 9.0; i > 0.0; i--) {
                setTimeout(() => { dayLight = i / 10.0; }, 100 * i);
            }
        }
    }
}

const MakeDay = () => {
    if (!dayTime) {
        dayTime = true;
        for (let i = 1; i < 10; i++) {
            setTimeout(() => { dayLight = i / 10.0; }, 100 * i);
        }
    }
}

const MakeNight = () => {
    if (dayTime) {
        dayTime = false;
        for (let i = 1; i < 10; i++) {
            setTimeout(() => { dayLight = (10 - i) / 10.0; }, 100 * i);
        }
    }
}

const Fog = (elem) => {
    fog = parseInt(elem.value);
}

const Angle = (elem) => {
    angle = parseInt(elem.value);
}