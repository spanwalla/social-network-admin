// import '../scss/style.scss';

const formAdd = document.getElementById("formAdd");
const formEdit = document.getElementById("formEdit");

if (formAdd) {
    formAdd.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        fetch(`/api/user`, {
            method: 'POST',
            body: formData
        }).then(response => {
            if (response.ok)
                return response.json();
            response.text().then(text => alert(text));
        }).then((json) => {
            if (json.error)
                alert(json.statusCode + json.error);
            else
                window.location.href = `/users/${json._id}/`;
        }).catch(err => alert(err));
    });
}

if (formEdit) {
    formEdit.addEventListener("submit", (e) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);
        fetch(`/api/user/${data.id}`, {
            method: 'PATCH',
            body: formData
        }).then(response => {
            if (response.ok)
                return response.json();
            else
                response.text().then(text => console.error(text));
        }).then(() => {
            window.location.href = `/users/${data.id}/`;
        }).catch(err => alert(err));
    });
}