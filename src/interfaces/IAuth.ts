interface IAuth {
    state : string, // Generated hex that provides protection against attacks such as cross-site request forgery.
    authCode: string, //An authorization code that can be exchanged for an Access Token.
    accessToken: string,
    refreshToken: string,
}

export default IAuth