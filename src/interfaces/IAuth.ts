interface IAuth {
    // Generated hex that provides protection against attacks such as cross-site request forgery.
    state: string,
    // An authorization code that can be exchanged for an Access Token.
    authCode: string,
    // An Access Token that can be provided in subsequent calls, for example to Spotify Web API services.
    accessToken: string,
    // 	A token that can be sent to the Spotify Accounts service in place of an authorization code.
    refreshToken: string,
}

export default IAuth