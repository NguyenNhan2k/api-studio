const handelCheckedBox = (nameInput) => {
    var submitElement = document.querySelector('.submit');
    var checkAll = document.querySelector('.check-all');
    var checkInputs = document.querySelectorAll('.form-check-input');
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
let files = [],
    dragArea = document.querySelector('.drag-area'),
    input = document.querySelector('.drag-area input'),
    button = document.querySelector('.card button');
select = document.querySelector('.drag-area .select');
container = document.querySelector('.container-imgs');
function handleMutipleImage() {
    if (select && input) {
        select.addEventListener('click', () => input.click());
        input.addEventListener('change', () => {
            let file = input.files;
            // if user select no image
            if (file.length == 0) return;

            for (let i = 0; i < file.length; i++) {
                if (file[i].type.split('/')[0] != 'image') continue;
                if (!files.some((e) => e.name == file[i].name)) files.push(file[i]);
            }

            input.files = null;
            showImages();
        });
        /* DRAG & DROP */
        dragArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            dragArea.classList.add('dragover');
        });

        /* DRAG LEAVE */
        dragArea.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dragArea.classList.remove('dragover');
        });

        /* DROP EVENT */
        dragArea.addEventListener('drop', (e) => {
            e.preventDefault();
            dragArea.classList.remove('dragover');

            let file = e.dataTransfer.files;
            for (let i = 0; i < file.length; i++) {
                /** Check selected file is image */
                if (file[i].type.split('/')[0] != 'image') continue;

                if (!files.some((e) => e.name == file[i].name)) files.push(file[i]);
            }
            showImages();
        });
    }
}
function showImages() {
    let images = files.reduce(function (prev, file, index) {
        return (prev += `<div class="image">
         <img src="${URL.createObjectURL(file)}" alt="image">
         <span onclick="delImage(${index})">&times;</span>
     </div>`);
    }, '');
    container.innerHTML = images;
}
function delImage(index) {
    files.splice(index, 1);
    showImages(files);
}
hiddenPwd();
