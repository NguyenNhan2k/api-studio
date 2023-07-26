const btnAddjob = document.querySelector('.btn-active-job');
const btnClose = document.querySelector('.btn-close-job');
const modalJob = document.querySelector('#modal-job');
const checkJob = document.querySelectorAll('.label-job');
const jobInputs = document.querySelector('[name="position"]:checked');
const submitJob = document.querySelector('.btn-submit-job');
const submitUpdateJob = document.querySelector('.btn-update-job');
const btnUpdateJob = document.querySelector('btn-submit-job');

const selectCustomer = document.querySelector('.select-customer');

class JobCalendar {
    constructor(id, name, assignDate, expireDate, status, detail = 'Trống') {
        this.id = id;
        this.name = name;
        this.assignDate = new Date(assignDate);
        this.expireDate = new Date(expireDate);
        this.status = status;
        this.detail = detail;
    }
    isValid() {
        return this.id && this.name && this.assignDate && this.expireDate && this.status;
    }
    isValidDate() {
        return this.expireDate > this.assignDate;
    }
}
class UIJobTable {
    constructor() {
        this.jobs = [];
        this.tbody = document.querySelector('.tbody-jobs');
    }
    convertToDate(date) {
        const result = new Date(date);
        return result.toLocaleString();
    }
    isEmpty() {
        return this.jobs.length > 0;
    }
    getOne(index) {
        return this.jobs[index];
    }
    render() {
        if (!this.isEmpty()) {
            this.tbody.innerHTML = `<td colspan='12' class='text-center'>
                    Danh sách trống !
                </td>`;
            return 0;
        }
        let trTable = '';
        this.jobs.forEach((job, index) => {
            const assignDate = job.assignDate.toLocaleString();
            const expireDate = job.expireDate.toLocaleString();
            trTable += `<tr>
            <td>${job.name} 
                <input type="text" value="${job.id}" name="id_customer[]" hidden>
            </td>
            <td >${assignDate}
                <input type="date" value="${assignDate}" name="assignDate[]" hidden>
            </td>
            <td>${expireDate}<input type="date" value="${expireDate}" name="expireDate[]" hidden></td>
            <td>${job.status}
            <input type="text" value="${job.status}" name="status[]" hidden>
            </td>
            <td>${job.detail}
                <input type="text" value="${job.detail}" name="detail[]" hidden>
            </td>
            <td>
                <button
                    class='btn btn-success px-1 py-1 update-job' type="button" onclick="updateJob(${index})"
                >
                <i class="fa-solid fa-pen-to-square"></i>
                </button>
            </td>
            <td>
                <button
                    class='btn btn-danger px-1 py-1 delete-job' onclick="deleteJob(${index})"
                >
                    <i class='fa-solid fa-trash'></i>
                </button>
            </td>
        </tr>`;
        });
        return (this.tbody.innerHTML = trTable);
    }
    add(job) {
        return this.jobs.push(job);
    }
    delete(index) {
        return this.jobs.splice(index, 1);
    }
    update(index, job) {
        return (this.jobs[index] = job);
    }
}
const uiJob = new UIJobTable();
uiJob.render();
const fetchPosistion = (payload) => {
    try {
        const url = `http://localhost:8001/positions/search/${payload}`;
        const respone = fetch(url, {
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
function getValueInput() {
    const customerEleJob = document.querySelector('.customer-job');
    const id = customerEleJob.value;
    const name = customerEleJob.options[customerEleJob.selectedIndex].text;
    const assignDate = document.querySelector('.assignDate-job').value;
    const expireDate = document.querySelector('.expireDate-job').value;
    const detail = document.querySelector('.detail-job').value;
    const status = document.querySelector('.status-job').value;
    return [id, name, assignDate, expireDate, status, detail];
}
function updateJob(index) {
    hiddenModalJob();
    submitUpdateJob.setAttribute('data-index', index);
}
function hiddenModalJob() {
    if (modalJob) modalJob.style.display = 'block';
}
function closeModalJob() {
    if (modalJob) modalJob.style.display = 'none';
}
function handleValueSelect(users) {
    const options = users.reduce((cur, acc) => {
        return cur + `<option value= "${acc.id}">${acc.firstName} ${acc.lastName}</option>`;
    }, '');
    return options;
}
function handleUpdateJob() {
    const indexJob = submitUpdateJob.dataset.index;
    const [id, name, assignDate, expireDate, status, detail] = getValueInput();
    const job = new JobCalendar(id, name, assignDate, expireDate, status, detail);
    uiJob.update(indexJob, job);
    uiJob.render();
    closeModalJob();
}
function deleteJob(index) {
    uiJob.delete(index);
    uiJob.render();
}
async function renderSelect(value = jobInputs.value) {
    const selectEle = document.querySelector('.select-customer');
    const { positions } = await fetchPosistion(value);
    const { users } = await positions[0];
    const options = await handleValueSelect(users);
    if (options) {
        selectEle.removeAttribute('disabled', '');
        selectEle.innerHTML = options;
    } else {
        selectEle.setAttribute('disabled', '');
        selectEle.innerHTML = `<option> Trống !</option>`;
    }
}

function handelSunmitJob() {
    const [id, name, assignDate, expireDate, status, detail] = getValueInput();
    const job = new JobCalendar(id, name, assignDate, expireDate, status, detail);
    if (!job.isValid()) {
        alert('Vui lòng nhập đầy đủ các trường!');
        return 0;
    }
    const isValidDate = job.isValidDate();
    if (!isValidDate) {
        alert('Chọn ngày không hợp lệ!');
        return 0;
    }
    uiJob.add(job);
    uiJob.render();
    closeModalJob();
}
function resetValueSelect() {
    return (selectCustomer.innerHTML = '');
}

if (btnAddjob)
    btnAddjob.addEventListener('click', () => {
        hiddenModalJob();
        renderSelect();
    });
if (btnClose) btnClose.addEventListener('click', closeModalJob);
if (submitJob) submitJob.addEventListener('click', handelSunmitJob);
if (checkJob) {
    checkJob.forEach((checkBox) => {
        checkBox.addEventListener('click', async (e) => {
            checkJob.forEach((checkBox) => {
                checkBox.classList.remove('btn-danger');
                checkBox.classList.add('btn-dark');
            });
            checkBox.classList.remove('btn-dark');
            checkBox.classList.add('btn-danger');
            resetValueSelect();
            const dataId = checkBox.dataset.id;
            renderSelect(dataId);
        });
    });
}
submitUpdateJob.addEventListener('click', handleUpdateJob);
