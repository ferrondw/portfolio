document.addEventListener('DOMContentLoaded', populateVariables);

async function populateVariables() {
    document.getElementById('collegeYear').innerHTML = '3rd';
    document.getElementById('college').innerHTML = 'Mediacollege Amsterdam';
    document.getElementById('collegeBranch').innerHTML = 'Software Development';
    document.getElementById('unityProjectAmount').innerHTML = '143';

    document.getElementById('age').innerHTML = getAge("2007-11-02");
}

function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}