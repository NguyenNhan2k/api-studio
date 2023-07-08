function displaySearch(eleSubmit, eleInput, table, dropdown, stringSearch) {
    const btnSubmit = document.querySelector(eleSubmit);
    const input = document.querySelector(eleInput);
    const dropdownMenu = document.querySelector(dropdown);
    dropdownMenu.style.display = 'none';
    const handleChange = async (e) => {
        try {
            const value = await e.target.value;
            if (value) {
                const respones = await callApiSearch(table, value);
                if (respones.hasOwnProperty(`${table}`) && respones[table]) {
                    const displaySearch = await stringSearch(table, respones);
                    dropdownMenu.style.display = 'block';
                    dropdownMenu.innerHTML = displaySearch;
                }
            } else {
                dropdownMenu.style.display = 'none';
                dropdownMenu.innerHTML = '';
            }
        } catch (error) {
            console.log(error);
            return 0;
        }
    };
    if (input) {
        input.addEventListener('input', handleChange);
    }
}
const callApiSearch = async (table, searchValue) => {
    try {
        const url = `http://localhost:8001/${table}/search/${searchValue}`;
        const respone = await fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((result) => {
            return result.json();
        });
        return respone;
    } catch (error) {
        console.log(error);
        return 0;
    }
};
const searchPosition = (table, respones) => {
    let listItems = '';
    respones[table].forEach((item) => {
        listItems += `<li class='list-group-item'>
                    <a href="/${table}/?search=${item.id}">${item.code} - ${item.value}</a>
                </li>`;
    });
    return listItems;
};
const searchUser = (table, respones) => {
    let listItems = '';
    respones[table].forEach((item) => {
        listItems += `<li class='list-group-item'>
                    <a href="/${table}/?search=${item.id}">${item.firstName} ${item.lastName} - ${item.phone}</a>
                </li>`;
    });
    return listItems;
};
const searchCustomer = (table, respones) => {
    let listItems = '';
    respones[table].forEach((item) => {
        listItems += `<li class='list-group-item'>
                    <a href="/${table}/?search=${item.id}">${item.firstName} ${item.lastName} - ${item.phone}</a>
                </li>`;
    });
    return listItems;
};
const searchWedding = (table, respones) => {
    let listItems = '';
    respones[table].forEach((item) => {
        listItems += `<li class='list-group-item'>
                    <a href="/${table}/?search=${item.id}">${item.code}- ${item.name}</a>
                </li>`;
    });
    return listItems;
};
const searchCategories = (table, respones) => {
    let listItems = '';
    respones[table].forEach((item) => {
        listItems += `<li class='list-group-item'>
                    <a href="/${table}/?search=${item.id}">${item.value}</a>
                </li>`;
    });
    return listItems;
};
