let btnAddMession = document.querySelector(".btn-add-mession");
let inpMission = document.querySelector(".inp-mission");
let secMession = document.querySelector(".sec-mession");
let theTime = document.querySelector(".the-time");

let mission_List = JSON.parse(localStorage.getItem("mission_List")) || [];
let missionId = JSON.parse(localStorage.getItem("missionId")) || 0;
// ============================================================= //
function Time(){
    let dateNow = new Date();
    let hours = dateNow.getHours();
    let realHours = (hours % 12) || 12;

    let minutes = dateNow.getMinutes();
    let realMinutes = minutes >= 10 ? minutes : `0${minutes}`;
    
    let pmOrAm = hours < 12 ? "Am" : "Pm";

    let collect = `${realHours}:${realMinutes} ${pmOrAm}`;
    theTime.innerHTML = collect;
    return collect;
}
setInterval(Time , 1000);

function The_date(){
    let dateNow = new Date;
    let date = `${dateNow.getFullYear()} / ${dateNow.getMonth() + 1} / ${dateNow.getDate()}`;
    return date;
}
// ============================================================= //
inpMission.addEventListener("input" , IS_valid_in_input);
function IS_valid_in_input(){
    if (inpMission.value.length > 20) {
        inpMission.style.backgroundColor = "crimson";
    }else{
        inpMission.style.backgroundColor = "white";
    }
}

btnAddMession.addEventListener("click" , Create_mission);
function Create_mission(){
    if (inpMission.value.length <= 20) 
    {
        let theDate = The_date();
        let check = false;
        let main_Obj = {
            checkDate: theDate,
            arrowRotate: "0deg",
            contentMission_State: "block",
            contentMission_List: [],
        }
        let mission_Obj = {
            id: ++missionId,
            title: inpMission.value,
            elements:`
                <i match-classes="inp&pen" class="fa-solid fa-pen btn-pen"></i>
                <i class="fa-regular fa-circle btn-complete"></i>
            `,
            bg: "#363535",
        }
        // ===== //
        if (mission_List.length > 0) 
        {
            mission_List.forEach(ele => {
                if (ele.checkDate == theDate) {
                    ele.contentMission_List.push(mission_Obj);
                    check = true;
                }else{
                    check = false;
                }
            });
        }

        if (check == false) {
            mission_List.push(main_Obj);
            main_Obj.contentMission_List.push(mission_Obj);
        }

        Turn_functions();
        inpMission.value = "";
        localStorage.setItem("mission_List" , JSON.stringify(mission_List));
        localStorage.setItem("missionId" , JSON.stringify(missionId));
    } else{
        inpMission.style.backgroundColor = "crimson";
    }
}
// ============================================================= //
function Show_mission(){
    let box = "";
    let content = "";
    mission_List.length > 0 ? secMession.innerHTML = "" : "" ;
    // ==== //
    for (let i = 0; i < mission_List.length; i++) {
        content = "";

        for (let j = 0; j < mission_List[i].contentMission_List.length; j++)
        {
            let obj = mission_List[i].contentMission_List[j];
                content += `
                    <div data-id=${obj.id} style="background-color:${obj.bg}" class="position-relative mession-box mb-2 text-light w-100 p-2 d-flex flex-column align-items-center">
                        <h2 class="mt-1 mission-title">${obj.title}</h2>
                        <i class="position-absolute top-0 start-0 m-2 cur fa-solid btn-delete-mission fa-trash text-danger"></i>
                        <div class="d-flex align-items-center gap-2 mt-2 ">
                            ${obj.elements}
                        </div>
                    </div>
            `
        }

        box = `
            <div class="container-mission">
                <div class="d-flex justify-content-between align-items-center mb-2 details-container-mission">
                    <h3 class="text-decoration-underline">Date : ${mission_List[i].checkDate}</h3>
                    <div>
                        <i style="transform: rotate(${mission_List[i].arrowRotate});" class="fa-solid fa-arrow-down btn-arrow-down me-2"></i>
                        <i class="cur fa-solid fa-trash btn-delete-container"></i>
                    </div>
                </div>

                <div class="content-mission ms-2" style="display:${mission_List[i].contentMission_State}" >
                    ${content}
                </div>
            </div> 
        `
        secMession.innerHTML += box;
    }
    // ==== //
}

function Turn_functions(){
    Show_mission();
    Show_content_container_mission();
    Delete_container_mission();
    Delete_mission();
    Change_mission_name();
    Complete_mission();
}
Turn_functions();
// ============================================================= //
function Show_content_container_mission() {
    let arrow = document.querySelectorAll(".btn-arrow-down");
    let contentMission = document.querySelectorAll(".content-mission");

    for (let i = 0; i < arrow.length; i++) {
        arrow[i].onclick = function () {
            if (getComputedStyle(arrow[i]).transform == 'matrix(1, 0, 0, 1, 0, 0)') 
            {
                $(arrow[i]).css("transform", "rotate(180deg)");
                $(contentMission[i]).slideUp();

                mission_List[i].contentMission_State = "none";
                mission_List[i].arrowRotate = "180deg";
            }
            else {
                $(arrow[i]).css("transform", "rotate(0deg)");
                $(contentMission[i]).slideDown();

                mission_List[i].contentMission_State = "block";
                mission_List[i].arrowRotate = "0deg";
            }
            localStorage.setItem("mission_List", JSON.stringify(mission_List));
        }
    }
}

function Delete_container_mission(){
    let btnDelete = document.querySelectorAll(".btn-delete-container");
    let containerMission = document.querySelectorAll(".container-mission");

    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].onclick = function(){
            if ( mission_List.length == 1 ) {
                secMession.innerHTML = `<h2 class="text-center">Go To Do It</h2>`;
                missionId = 0;
                localStorage.setItem("missionId" , JSON.stringify(missionId));
            }
            mission_List.splice(i , 1);
           $(containerMission[i]).remove();
            localStorage.setItem("mission_List" , JSON.stringify(mission_List));
            Show_content_container_mission();
        }
    }
}

function Delete_mission(){
    let btnDelete = document.querySelectorAll(".btn-delete-mission");
    let mission = document.querySelectorAll(".mession-box");

    for (let i = 0; i < btnDelete.length; i++) {
        btnDelete[i].onclick = function(){
            let getAttr = mission[i].getAttribute("data-id");
            let [arr , obj] = Get_mission_obj_for_delete(+getAttr);

            $(mission[i]).remove();
            arr.contentMission_List.splice(obj , 1);
            localStorage.setItem("mission_List" , JSON.stringify(mission_List));
            Complete_mission();
        }
    }
}

function Get_mission_obj_for_delete(idMission) {
    for (let i = 0; i < mission_List.length; i++) {
        for (let j = 0; j < mission_List[i].contentMission_List.length; j++) {
            if (mission_List[i].contentMission_List[j].id == idMission) {
                return [mission_List[i], j]; 
            }
        }
    }
}
// ============================================================= //
function Change_mission_name() {
    let btnPen = document.querySelectorAll(".btn-pen");
    let input = document.createElement("input");
    input.setAttribute("class", "inp-mission-name");
    input.setAttribute("placeholder", "Change name");
    input.setAttribute("match-classes", "inp&pen");

    for (let i = 0; i < btnPen.length; i++) {
        btnPen[i].onclick = function(e) {
            let mission = btnPen[i].closest(".mession-box");
            let clientX = e.clientX;
            let clientY = e.clientY + window.scrollY;
            let getIndex = +mission.getAttribute("data-id");
            let missionTitle = mission.querySelector(".mission-title");
            // ===== //
            input.style.left = `${clientX - 100}px`;
            input.style.top = `${clientY - 20}px`;
            document.body.appendChild(input);
            input.value = "";
            input.style.backgroundColor = "white";
            Hidden_input(input);
            Check_change_mission_name(input, getIndex, missionTitle);
        };
    }
}

function Get_obj(index) {
    for (let i = 0; i < mission_List.length; i++) {
        for (let j = 0; j < mission_List[i].contentMission_List.length; j++) {
            if (mission_List[i].contentMission_List[j].id == index) {
                return mission_List[i].contentMission_List[j];
            }
        }
    }
}

function Check_change_mission_name(input, getIndex, missionTitle) {
    let obj = Get_obj(getIndex);

    input.oninput = function(){
        if (input.value.length <= 20) {
            obj.title = input.value;
            missionTitle.innerHTML = input.value;
            localStorage.setItem("mission_List", JSON.stringify(mission_List));
            input.style.backgroundColor = "white";
        } else {
            input.style.backgroundColor = "crimson";
        }
    }
}

function Hidden_input(input) {
    document.body.onclick = function(e) {
        let getClassElement = e.target.hasAttribute("match-classes");
        if (false == getClassElement) {
            $(input).remove();
        }
    }
}
// ============================================================= //
function Complete_mission(){
    let btnComplete = document.querySelectorAll(".btn-complete");

    for (let i = 0; i < btnComplete.length; i++) {
        btnComplete[i].onclick = function(){
            let mission = btnComplete[i].closest(".mession-box");
            let getIndex = +mission.getAttribute("data-id");
            let div = mission.querySelector("div");
            let theTime = Time();
            let obj = Get_obj(getIndex);
            let timeElement = `<h3 class="text-warning"> ${theTime} </h3>`;
            let elements = timeElement;
            // ==== //
            div.innerHTML = elements;
            mission.style.backgroundColor = "green";
            obj.bg = "green";
            obj.elements = timeElement;
            localStorage.setItem("mission_List" , JSON.stringify(mission_List));
        }
    }
}