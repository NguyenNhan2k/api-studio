const displayModalCommnent = () => {
    const addComment = document.querySelector('.button-comment');
    const modalComment = document.querySelector('.modal-comment');
    if (addComment) {
        addComment.addEventListener('click', () => {
            modalComment.style.display = 'flex';
        });
    }
};
function closeModalComment(close, modal) {
    const eleClose = document.querySelector(close);
    const eleModal = document.querySelector(modal);
    if (eleClose && eleModal) {
        eleModal.style.display = 'none';
    }
}
var eleModal = document.querySelector('#modal');
const closeModal = (close, btnClose, active, modalTitle, modalText) => {
    const modalTextEle = document.querySelector('.modal-body__text');
    const modalTitleEle = document.querySelector('.modal-title');
    const eleClose = document.querySelector(close);
    const buttonClose = document.querySelector(btnClose);
    const eleActives = document.querySelectorAll(active);

    if (eleClose && eleActives) {
        eleActives.forEach((item) => {
            const dataId = item.getAttribute('data-id');
            const dataActions = item.getAttribute('data-actions');
            const dataTable = item.getAttribute('data-table');
            item.addEventListener('click', (e) => {
                e.preventDefault();
                (modalTextEle.innerHTML = modalText), (modalTitleEle.innerHTML = modalTitle);
                eleModal.style.display = 'flex';
                eleModal.setAttribute('data-id', dataId);
                eleModal.setAttribute('data-actions', dataActions);
                eleModal.setAttribute('data-table', dataTable);
                formDelete();
            });
        });

        eleClose.addEventListener('click', () => {
            eleModal.style.display = 'none';
        });
        buttonClose.addEventListener('click', () => {
            eleModal.style.display = 'none';
        });
    }
};
const formDelete = () => {
    const formEle = document.querySelector('#deleteOne');
    const btnSubmitEl = document.querySelector('.btn-submit-modal');
    if ((formEle, btnSubmitEl)) {
        const dataId = eleModal.getAttribute('data-id');
        const action = eleModal.getAttribute('data-actions');
        const table = eleModal.getAttribute('data-table');
        switch (action) {
            case 'destroy':
                formEle.action = `/${table}/destroy/${dataId}?_method=DELETE`;
                btnSubmitEl.addEventListener('click', () => {
                    formEle.submit();
                });
                break;
            case 'restore':
                formEle.action = `/${table}/restore/${dataId}?_method=PATCH`;
                btnSubmitEl.addEventListener('click', () => {
                    formEle.submit();
                });
                break;
            case 'force':
                formEle.action = `/${table}/force/${dataId}?_method=DELETE`;
                btnSubmitEl.addEventListener('click', () => {
                    formEle.submit();
                });
                break;
        }
    }
};
