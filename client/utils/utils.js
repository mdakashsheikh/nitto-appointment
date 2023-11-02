export function saveJWT(jwtToken) {
    window.localStorage.setItem('jwt_token_assist', jwtToken);
}

export function getJWT() {
    return window.localStorage.getItem('jwt_token_assist');
}

export function saveUserName(userName) {
    window.localStorage.setItem('jwtUserName', userName);
}

export function getUserName() {
    return window.localStorage.getItem('jwtUserName');
}

export function saveDoctor(role) {
    window.localStorage.setItem('jwtDoctor', role);
}

export function getDoctor() {
    return window.localStorage.getItem('jwtDoctor');
}

export function deleteToken() {
    window.localStorage.removeItem('jwt_token_assist');
    window.localStorage.removeItem('jwtUserName');
    window.localStorage.removeItem('jwtDoctor');
}