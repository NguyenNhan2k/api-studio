const activeModal = document.querySelector('.btn-active-receipt');
const closeActice = document.querySelectorAll('.btn-close-receipt');
const updateActice = document.querySelector('.btn-update-receipt');
const checkedValue = document.querySelectorAll('.form-check-label');
const inputs = document.querySelectorAll('[name="category"]');
const modal = document.querySelector('.modal-receipt');
const tbodyEle = document.querySelector('.tbody-receipt');
const fetchCategories = async () => {
    try {
        const url = await `http://localhost:8001/categories/getAll`;
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
    }
};
const getArrCategories = async () => {
    try {
        const respone = await fetchCategories();
        const categories = (await respone) && respone.categories;
        return categories;
    } catch (error) {
        console.log(error);
    }
};
const convertToVND = (payload) => {
    const config = { style: 'currency', currency: 'VND' };
    const formated = new Intl.NumberFormat('vi-VN', config).format(payload);
    return formated;
};

const uiSelectCheckBox = async () => {
    if (checkedValue) {
        checkedValue.forEach((checkBox) => {
            checkBox.addEventListener('click', (e) => {
                checkedValue.forEach((checkBox) => {
                    checkBox.classList.remove('btn-danger');
                    checkBox.classList.add('btn-dark');
                });
                valueSelect();
                checkBox.classList.remove('btn-dark');
                checkBox.classList.add('btn-danger');
            });
        });
    }
};
const valueSelect = async () => {
    const categories = await getArrCategories();
    let getValue = await '';
    await inputs.forEach((input) => {
        const isChecked = input.checked;
        const value = input.value;
        if (isChecked) {
            getValue = categories.filter((category) => {
                return value == category.id;
            });
        }
    });
    await displaySelect(getValue);
};
const displaySelect = (category) => {
    const select = document.querySelector('#id-target');
    let targets = '';
    if (category[0].value == 'Phụ kiện') {
        targets = category[0].accessories;
    } else {
        targets = category[0].weddings;
    }
    let options = '';
    targets.forEach((target) => {
        options += `<option value= "${target.id}">${target.name}</option>`;
    });
    select.innerHTML = options;
};
const getCookie = (name) => {
    const cDecoded = decodeURIComponent(document.cookie);
    const value = `; ${cDecoded}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};
const initReceipt = (nameCoookie) => {
    const cookie = getCookie(nameCoookie);
    if (cookie) {
        const cutString = cookie.slice(2);
        const objCookie = JSON.parse(cutString);
        return objCookie.detailReceipts;
    }
    return [];
};
var receiptDetail = initReceipt('detailReceipts');
const uiDisplayTable = () => {
    if (receiptDetail.length == 0) {
        tbodyEle.innerHTML = `<td colspan='12' class='text-center'>
        Danh sách trống !
    </td>`;
    } else {
        let trTable = '';
        receiptDetail.forEach((reciept, index) => {
            const total = convertToVND(reciept.total);
            const price = convertToVND(reciept.price);
            trTable += `<tr>
            <td>
            ${index + 1}
            </td>
            <td>${reciept.name}
                <input type="text" value="${reciept.id_target}" name="id_target[]" hidden>
            </td>
            <td >${reciept.quanlity}
                <input type="number" value="${reciept.quanlity}" name="quanlity[]" hidden>
            </td>
            <td>${price}<input type="number" value="${reciept.price}" name="price[]" hidden></td>
            <td>${total}
                <input type="number" value="${reciept.total}" name="total[]" hidden>
            </td>
            <td>
                <button
                    class='btn btn-success px-1 py-1' type="button" onclick="updateItem(${index})"
                >
                <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td>
                <button
                    class='btn btn-danger px-1 py-1' onclick="deteleItem(${index})"
                >
                    <i class='fa-solid fa-trash'></i>
                </button>
            </td>
        </tr>`;
        });
        tbodyEle.innerHTML = trTable;
    }
};
const submitModal = document.querySelector('.btn-submit-receipt');
const idtarget = document.querySelector('#id-target');
const quanlityEle = document.querySelector('#quanlity');
const priceEle = document.querySelector('#price');
const handleSubmitModal = () => {
    if (submitModal) {
        submitModal.addEventListener('click', (e) => {
            e.preventDefault();
            const valueId = idtarget.value;
            const quanlity = quanlityEle.value;
            const price = priceEle.value;
            var name = idtarget.options[idtarget.selectedIndex].text;
            if (!valueId || !quanlity || !price || !name) {
                return alert('Vui longg nhap vao!');
            }
            const output = {
                id_target: valueId,
                quanlity: quanlity,
                name: name,
                price: price,
                total: parseInt(quanlity) * parseInt(price),
            };
            receiptDetail.push(output);
            modal.style.display = 'none';
            uiDisplayTable();
        });
    }
};
closeActice.forEach((item) => {
    item.addEventListener('click', () => {
        modal.style.display = 'none';
    });
});
activeModal.addEventListener('click', () => {
    modal.style.display = 'block';
});
const deteleItem = (index) => {
    receiptDetail.splice(index, 1);
    uiDisplayTable();
};
const updateItem = (index) => {
    modal.style.display = 'block';
    const objUpdate = receiptDetail[index];
    quanlity.value = objUpdate.quanlity;
    price.value = objUpdate.price;
    updateActice.addEventListener('click', (e) => {
        const valueId = idtarget.value;
        const quanlity = quanlityEle.value;
        const price = priceEle.value;
        var name = idtarget.options[idtarget.selectedIndex].text;
        const output = {
            id_target: valueId,
            quanlity: quanlity,
            name: name,
            price: price,
            total: parseInt(quanlity) * parseInt(price),
        };
        receiptDetail[index] = output;
        uiDisplayTable();
        modal.style.display = 'none';
    });
};
uiDisplayTable();
handleSubmitModal();
valueSelect();
uiSelectCheckBox();
