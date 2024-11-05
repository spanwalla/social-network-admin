const formDelete = document.getElementById('formDelete');
const navUserFeedLink = document.getElementById('navUserFeedLink');
const userShort = document.getElementById('userShort');

navUserFeedLink.setAttribute('href', '/feed/' + userShort.getAttribute('data-id'));
navUserFeedLink.classList.remove('disabled');

formDelete.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(formDelete));
    fetch(`/api/user/${data.id}`, {
        method: 'DELETE'
    }).then(response => {
        if (response.ok)
            return response.json();
        response.text().then(text => alert(text));
    }).then((json) => {
        if (json.error)
            alert(json.error);
        else
            window.location.href = '/users/all';
    }).catch(err => alert(err));
});