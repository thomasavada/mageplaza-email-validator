const btnValidate = document.querySelector('#validate');
const btnClear = document.querySelector('#clear');
const autoClearEl = document.querySelector('#autoclear');
const inputEmailEl = document.querySelector('#input-email');
const goodEmailEl = document.querySelector('#good-email');
const unsureEmailEl = document.querySelector('#unsure-email');
const badEmailEl = document.querySelector('#bad-email');
const GOOD_POINT = 3;
const UNSURE_POINT = 2;

btnClear.addEventListener('click', function(e) {
	inputEmailEl.value = '';
	goodEmailEl.value = '';
	unsureEmailEl.value = '';
	badEmailEl.value = '';
});

btnValidate.addEventListener('click', function(e) {
    e.preventDefault();
    let inputEmailVal = inputEmailEl.value.trim().split('\n').map(email => email.trim());
    if(!inputEmailEl.value.trim().length) return;
    inputEmailVal = {
        email: inputEmailVal
    };
    btnValidate.textContent = 'Checking';
    fetch('/emails', {
            method: "POST", // *GET, POST, PUT, DELETE, etc.
            headers: {
                "Content-Type": "application/json; charset=utf-8",
            },
            body: JSON.stringify(inputEmailVal), // body data type must match "Content-Type" header
        })
        .then(resp => resp.json())
        .then(data => {
            const {emails} = data;
            const goodEmails = emails.filter(emailObj => emailObj.code == GOOD_POINT);
            const unsureEmails = emails.filter(emailObj => emailObj.code == UNSURE_POINT);
            const badEmails = emails.filter(emailObj => emailObj.code < UNSURE_POINT);
            goodEmailEl.value = formatEmail(goodEmails);
            unsureEmailEl.value = formatEmail(unsureEmails);
            badEmailEl.value = formatEmail(badEmails);

            //clear input email
            if(!!autoClearEl.checked){
            	inputEmailEl.value = '';
            }
            btnValidate.textContent = 'Process';
        })
        .catch(err => {
        	alert('Error happened. Check the console');
        	console.error('Email Validator Error:', err);
        	btnValidate.textContent = 'Process';
        })
});

function formatEmail(emails){
	return emails.map(emailObj => emailObj.email).join('\n');
}