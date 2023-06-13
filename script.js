const submitButton = document.getElementById('submit-button');
const messageInput = document.getElementById('message');
const animationContainer = document.getElementById('animation-container');
let animation;

// Load the animation
lottie.loadAnimation({
  container: animationContainer,
  renderer: 'svg',
  loop: true,
  autoplay: false,
  path: '134344-robot.json' // Update the path to your JSON file
}).then(anim => {
  animation = anim;
});

submitButton.addEventListener('click', () => {
  const userInput = messageInput.value.trim();
  if (userInput === '') return;

  // Disable the submit button and display loading text
  submitButton.disabled = true;
  submitButton.value = 'Loading...';

  // Show the animation
  animationContainer.style.display = 'block';
  animation.play();

  // Make the API call to ChatGPT
  makeChatGPTAPIRequest(userInput)
    .then(answer => {
      console.log('API Response:', answer);
      replaceInputWithResponse(answer);
      animation.stop();
      animationContainer.style.display = 'none';
    })
    .catch(error => {
      console.error('Error:', error);
      replaceInputWithResponse('Sorry, something went wrong. Please try again.');
      animation.stop();
      animationContainer.style.display = 'none';
    })
    .finally(() => {
      // Enable the submit button and change the text back to 'Submit'
      submitButton.disabled = false;
      submitButton.value = 'Submit another question';
    });
});

function makeChatGPTAPIRequest(input) {
  // Replace <YOUR_API_KEY> with your actual API key
  const apiKey = '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';
  const url = `https://api.openai.com/v1/engines/davinci-codex/completions`;
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${apiKey}`
  };
  const data = {
    'prompt': input,
    'max_tokens': 50,
    'temperature': 0.7,
    'n': 1,
    'stop': '\n'
  };

  return fetch(url, {
    method: 'POST',
    headers: headers,
    body: JSON.stringify(data)
  })
    .then(response => response.json())
    .then(data => {
      if (data.choices && data.choices.length > 0) {
        return data.choices[0].text.trim();
      } else {
        throw new Error('Invalid API response');
      }
    });
}

function replaceInputWithResponse(response) {
  const inputContainer = document.querySelector('.input-container');
  const responseElement = document.createElement('div');
  responseElement.className = 'response';
  responseElement.textContent = response;
  inputContainer.parentNode.replaceChild(responseElement, inputContainer);
}
