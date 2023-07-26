class Checkout {
    constructor(code, type, price, detail) {
        this.code = code;
        this.type = type;
        this.price = price;
        this.detail = detail;
    }
}
class UiCheckout {
    constructor() {
        this.checkouts = [];
        this.tbody = document.querySelector('.tbody-checkout');
    }
    invalid(checkout) {
        return Array.isArray(checkout) && checkout.length > 0;
    }
    add(checkout) {
        return this.checkouts.push(checkout);
    }
    convertToVND(payload) {
        const config = { style: 'currency', currency: 'VND' };
        const formated = new Intl.NumberFormat('vi-VN', config).format(payload);
        return formated;
    }
    isEmpty() {
        return this.checkouts.length > 0;
    }
    render() {
        if (!this.isEmpty()) {
            this.tbody.innerHTML = `<td colspan='12' class='text-center'>
                    Danh sách trống !
                </td>`;
            return 0;
        }
        let trTable = '';
        this.checkouts.forEach((checkout, index) => {
            const price = this.convertToVND(checkout.price);
            trTable += `<tr>
            <td>
               ${index + 1}
            </td>
            <td>${checkout.code}
                <input type="text" value="${checkout.code}" name="code[]" hidden>
            </td>
            <td >${checkout.type}
                <input type="number" value="${checkout.type}" name="type[]" hidden>
            </td>
            <td>${price}<input type="number" value="${checkout.price}" name="price[]" hidden></td>
            <td>${checkout.detail}
                <input type="number" value="${checkout.detail}" name="detail[]" hidden>
            </td>
            <td>
                <button
                    class='btn btn-success px-1 py-1 update-checkout' type="button" onclick= "updateCheckout(${index})"
                >
                <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td>
                <button
                    class='btn btn-danger px-1 py-1 delete-checkout' onclick= "deleteCheckout(${index})"
                >
                    <i class='fa-solid fa-trash'></i>
                </button>
            </td>
        </tr>`;
        });
        this.tbody.innerHTML = trTable;
    }
    getOne(index) {
        return this.checkouts[index];
    }
    delete(index) {
        return this.checkouts.splice(index, 1);
    }
    update(index, checkout) {
        return (this.checkouts[index] = checkout);
    }
}

const addCheckout = document.querySelector('.btn-active-checkout');
const closeCheckout = document.querySelector('.btn-close-checkout');
const modalCheckout = document.querySelector('.modal-checkout');
const submitChekout = document.querySelector('.btn-submit-checkout');
const submitupdateChekout = document.querySelector('.btn-update-checkout');

const code = document.querySelector('.code-checkout');
const type = document.querySelector('.type-checkout');
const price = document.querySelector('.price-checkout');
const detail = document.querySelector('.detail-checkout');
const uiCheckout = new UiCheckout();
uiCheckout.render();
function handelHindenModal(e) {
    if (modalCheckout) modalCheckout.style.display = 'block';
}
function handelCloseModal(e) {
    if (modalCheckout) modalCheckout.style.display = 'none';
}
function getValueInput() {
    const codeValue = code.value;
    const typeValue = type.value;
    const priceValue = price.value;
    const detailValue = detail.value;
    return [codeValue, typeValue, priceValue, detailValue];
}
function handelSunmitCheckout() {
    const [codeValue, typeValue, priceValue, detailValue] = getValueInput();
    const checkout = new Checkout(codeValue, typeValue, priceValue, detailValue);
    uiCheckout.add(checkout);
    uiCheckout.render();
    handelCloseModal();
}
function updateCheckout(index) {
    handelHindenModal();
    const checkout = uiCheckout.getOne(index);
    submitupdateChekout.setAttribute('data-index', index);
}
function deleteCheckout(index) {
    uiCheckout.delete(index);
    uiCheckout.render();
}
function submitUpdateCheckout() {
    const indexCheckout = submitupdateChekout.dataset.index;
    const [codeValue, typeValue, priceValue, detailValue] = getValueInput();
    const checkout = new Checkout(codeValue, typeValue, priceValue, detailValue);
    uiCheckout.update(indexCheckout, checkout);
    uiCheckout.render();
    handelCloseModal();
}

submitupdateChekout.addEventListener('click', submitUpdateCheckout);
addCheckout.addEventListener('click', handelHindenModal);
submitChekout.addEventListener('click', handelSunmitCheckout);
closeCheckout.addEventListener('click', handelCloseModal);
