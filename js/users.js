const usersTableBody = document.getElementById("usersTable").querySelector("tbody");

for (let row of usersTableBody.rows) {
    row.addEventListener('click', function () {
        window.location.href = `/users/${row.getAttribute('data-id')}/`;
    });
}