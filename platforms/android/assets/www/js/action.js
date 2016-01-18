function switchMode() {
    switch (timeTable.mode) {
        case "view":
            // switch to edit
            timeTable.mode = "edit";
            setMode();
            break;
        case "edit":
            // open save alert modal
            modalController('#modal-SaveAlert', "show");
            break;
    }
}

function switchTableType() {
    switch (timeTable.tableType) {
        case "day":
            // switch to night
            timeTable.tableType = "night";
            break;
        case "night":
            // switch to both
            timeTable.tableType = "both";
            break;
        case "both":
            // switch to day
            timeTable.tableType = "day";
            break;
    }
    setTableType();
}

function switchWeekType() {
    switch (timeTable.weekType) {
        case "normal":
            // switch to weekend
            timeTable.weekType = "weekend";
            break;
        case "weekend":
            // switch to normal
            timeTable.weekType = "normal";
            break;
    }
    setWeekType();
}

function saveChange() {
    // save change and switch to view
    modalController('#modal-SaveAlert', "hide");
    updateDB(0, "tableField", JSON.stringify(timeTable.data.tableField));
    clearSelected();
    timeTable.mode = "view";
    setMode();
}

function edit() {
    console.log(timeTable.onSelected);
    if (timeTable.onSelected.length != 0) {
        modalController('#modal-ClassEdit', "show");
    } else {
        modalController('#modal-SelectAlert', "show");
    };
}

function save() {
    for (var i = 0; i < timeTable.onSelected.length; i++) {
        console.log(timeTable.onSelected[i]);
        var course = document.getElementById("input_class_name").value;
        var classRoom = document.getElementById("input_class_room").value;
        timeTable.data.tableField[timeTable.onSelected[i].row-1][timeTable.onSelected[i].cell-1].course = course;
        timeTable.data.tableField[timeTable.onSelected[i].row-1][timeTable.onSelected[i].cell-1].classRoom = classRoom;
    };
    modalController('#modal-ClassEdit', "hide");
    setData();
}

function restore() {
    clearSelected();
    modalController('#modal-RestoreAlert', "hide");
}

function clearSelected() {
    var table = document.getElementById("tableArea");
    for (var i = timeTable.onSelected.length - 1; i >= 0; i--) {
        var target = table.rows[timeTable.onSelected[i].row].cells[timeTable.onSelected[i].cell];
        target.classList.remove("selected");
    };
    timeTable.onSelected.splice(0, timeTable.onSelected.length);
}

function ClassEvent() {
    var table = document.getElementById("tableArea");
    switch (timeTable.mode) {
        case "view":
            console.log(timeTable.data.tableField[this.parentNode.rowIndex-1][this.cellIndex-1]);
            document.getElementById("classInfo-className").innerHTML = timeTable.data.tableField[this.parentNode.rowIndex-1][this.cellIndex-1].course;
            document.getElementById("classInfo-classRoom").innerHTML = timeTable.data.tableField[this.parentNode.rowIndex-1][this.cellIndex-1].classRoom;
            modalController('#modal-ClassInfo', "show");
            break;
        case "edit":
            var target = table.rows[this.parentNode.rowIndex].cells[this.cellIndex];
            if (target.classList.contains("selected")) {
                for (var i = timeTable.onSelected.length - 1; i >= 0; i--) {
                    if (timeTable.onSelected[i].row == this.parentNode.rowIndex && timeTable.onSelected[i].cell == this.cellIndex) {
                        var rmIndex = i;
                    };
                };
                if (rmIndex > -1) {
                    timeTable.onSelected.splice(rmIndex, 1);
                }
                target.classList.remove("selected");
            } else {
                timeTable.onSelected.push({
                    "row": this.parentNode.rowIndex,
                    "cell": this.cellIndex
                });
                target.classList.add("selected");
            };
            break;
    }
}

function modalController(modalId, method) {
    $(modalId).modal(method);
}
