document.getElementById("myForm").addEventListener("submit", storageData);


var submitBtn = document.getElementById("submitBtn");

var checkbox = document.getElementById("checkData");


submitBtn.disabled = true;


checkbox.addEventListener('change', function() {
    if (this.checked) {
        console.log("Checkbox is checked..");
        submitBtn.disabled = false;



    } else {
        console.log("Checkbox is not checked..");
        submitBtn.disabled = true;

    }
});


function storageData() {


    var age, gender, education, experience, auth;

    age = document.getElementById("inputAge").value;
    console.log(age);
    gender = document.getElementById("inputGender").value;
    education = document.getElementById("inputEducation").value;
    experience = document.getElementById("inputExperience").value;
    auth = document.getElementById("checkData");

    chrome.storage.sync.set({
        age: age,
        gender: gender,
        education: education,
        experience: experience,
        auth: auth.checked,
        automatic_evaluation: false,
        lang:"en"
    });


}