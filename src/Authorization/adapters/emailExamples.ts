export const emailExamples = {
    registrationEmail(code: string) {
        const ngrokUrl = '   https://fed2-195-238-124-56.ngrok-free.app ';
        return ` <h1>Thank for your registration</h1>
               <p>To finish registration please follow the link below:<br>
                  <a href='${ngrokUrl}/auth/registration-confirmation?code=${code}'>complete registration</a>
              </p>`;
    },
    passwordRecoveryEmail(code: string) {
        const ngrokUrl = '  https://fed2-195-238-124-56.ngrok-free.app';
        return `<h1>Password recovery</h1>
        <p>To finish password recovery please follow the link below:
            <a href='${ngrokUrl}/auth/password-recovery?recoveryCode=${code}'>recovery password</a>
        </p>`;
    }
}