const signBtn = document.getElementById('sign-btn');
const userName = document.getElementById('user-name');
const userPassword = document.getElementById('user-password');

signBtn.addEventListener('click', () => {
    const userNameValue = userName.value;
    const userPasswordValue = userPassword.value;

    if (userNameValue === 'admin' && userPasswordValue === 'admin123') {
        alert('Sign In Success!');
        window.location.assign('./home.html');
    } else {
        alert('Sign In Failed');
        return;
    }
    
});