const requiredFields = '{{ requiredFields }}'.split(',')
const imageLogoUrl = '{{ imageLogoUrl }}';

const formFields = [];
requiredFields.forEach(f => {
  formFields.push({
    label: _.startCase(f),
    type: 'text',
    name: f,
    required: true
  })
});

function createDynamicForm() {
  const form = document.createElement('form');
  form.classList.add('form-signin');
  form.method = 'POST';
  form.enctype = 'multipart/form-data';

  formFields.forEach(field => {
    const label = document.createElement('label');
    label.textContent = field.label;
    label.htmlFor = field.name;
    label.className = 'sr-only';

    const input = document.createElement('input');
    input.type = field.type;
    input.name = field.name;
    input.className = 'form-control';
    input.placeholder = field.label;
    input.required = field.required;

    form.appendChild(label);
    form.appendChild(input);
  });

  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.className = 'btn btn-lg btn-primary btn-block';
  submitButton.id = 'registerButton';
  submitButton.textContent = 'Register';
  form.appendChild(submitButton);

  return form;
}

const toggleSpinnerAndText = (button, showSpinner) => {
  const spinner = document.createElement('span');
  spinner.className = 'spinner-border spinner-border-sm';
  spinner.setAttribute('role', 'status');
  spinner.setAttribute('aria-hidden', 'true');

  if (showSpinner) {
    button.disabled = true;
    button.replaceChildren(spinner);
  } else {
    button.disabled = false;
    button.textContent = 'Register';
  }
};

// Only allow known Bootstrap contextual classes to reach the DOM.
const ALLOWED_ALERT_CLASSES = ['primary', 'danger'];

const showAlert = (cssClass, message) => {
  if (!ALLOWED_ALERT_CLASSES.includes(cssClass)) {
    cssClass = 'primary';
  }

  const alertDiv = document.createElement('div');
  alertDiv.className = `alert alert-${cssClass} alert-dismissible`;
  alertDiv.setAttribute('role', 'alert');

  // Render the message as text, never as HTML, to prevent DOM-based XSS.
  const strong = document.createElement('strong');
  strong.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.className = 'close';
  closeButton.type = 'button';
  closeButton.setAttribute('data-dismiss', 'alert');
  closeButton.setAttribute('aria-label', 'Close');

  const closeIcon = document.createElement('span');
  closeIcon.setAttribute('aria-hidden', 'true');
  closeIcon.textContent = '×';
  closeButton.appendChild(closeIcon);

  alertDiv.appendChild(strong);
  alertDiv.appendChild(closeButton);

  document.querySelector('#alert').appendChild(alertDiv);
};

const getUrlParameter = (name) => {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
  const regex = new RegExp(`[\\?&]${name}=([^&#]*)`);
  const results = regex.exec(location.search);
  return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
};

const handleFormSubmit = async (event) => {
  event.preventDefault();

  const postUrl = `/subscriber`;
  const regToken = getUrlParameter('x-amzn-marketplace-token');

  if (!regToken) {
    showAlert('danger',
      'Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!');
  } else {
    const form = document.getElementsByClassName('form-signin')[0];
    const submitButton = document.getElementById('registerButton');
    const data = Object.fromEntries(new FormData(form));
    data.regToken = regToken;

    // Show the spinner and disable the button
    toggleSpinnerAndText(submitButton, true);

    try {
      const response = await fetch(postUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const { message } = await response.json();
      showAlert('primary', message);
    } catch (error) {
      console.error('Error:', error);
      showAlert('danger', 'An error occurred while submitting the form.');
    } finally {
      // Hide the spinner and restore the button text
      toggleSpinnerAndText(submitButton, false);
    }
  }
};

const regToken = getUrlParameter('x-amzn-marketplace-token');
if (!regToken) {
  showAlert('danger', 'Registration Token Missing. Please go to AWS Marketplace and follow the instructions to set up your account!');
}
window.onload = function() {
  const container = document.querySelector('.container');
  const spinnerContainer = document.getElementById('spinner');
  const form = createDynamicForm(); // Destructure form and submitButton

  // Show the spinner
  spinnerContainer.style.display = 'flex';

  form.addEventListener('submit', handleFormSubmit);
  container.appendChild(form);

  // Hide the spinner after the form is rendered
  spinnerContainer.style.display = 'none';

  const imgElement = document.querySelector('.container .img-fluid');
  imgElement.src = imageLogoUrl;
};
