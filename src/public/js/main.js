const handelCheckedBox = (nameInput) => {
    var submitElement = document.querySelector('.submit');
    var checkAll = document.querySelector('.check-all');
    var checkInputs = document.querySelectorAll('.form-check-input');
    console.log(submitElement, checkAll, checkInputs);
    if (checkAll) {
        checkAll.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            for (let i = 0; i < checkInputs.length; i++) {
                checkInputs[i].checked = isChecked;
            }
            renderSubmitBtn();
        });
    }
    for (let i = 0; i < checkInputs.length; i++) {
        checkInputs[i].addEventListener('change', (e) => {
            const countInputChecked = document.querySelectorAll(nameInput).length;
            const isChecked = checkInputs.length === countInputChecked;
            checkAll.checked = isChecked;
            renderSubmitBtn();
        });
    }
    function renderSubmitBtn() {
        const countChecked = document.querySelectorAll(nameInput).length;
        if (countChecked > 0) {
            submitElement.removeAttribute('disabled');
        } else {
            submitElement.setAttribute('disabled', 'disabled');
        }
    }
};

const hiddenPwd = () => {
    const iconHiden = document.querySelector('#hidden-password');
    const input = document.querySelector('#password');
    iconHiden &&
        iconHiden.addEventListener('click', () => {
            if (iconHiden.classList.contains('hidden')) {
                iconHiden.setAttribute('class', ' fa-solid fa-eye fs-4 fs-4');
                input.type = 'text';
            } else {
                iconHiden.setAttribute('class', 'fa-solid fa-eye-slash fs-4 hidden');
                input.type = 'password';
            }
        });
};

hiddenPwd();
