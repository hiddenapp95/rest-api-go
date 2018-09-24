let __googleSdkReady = false;
let __googleCallbacks = [];

export const GooglePlusProxy = {

    isAvailable: function (success, error) {
        if (!__googleSdkReady) {
            return __googleCallbacks.push(function() {
                this.isAvailable(success, error);
            });
        }

        success(window.gapi !== undefined);
    },

    updateSigninStatus: function (isSignedIn, success, error) {
        if (isSignedIn) {
            let auth2 = window.gapi.auth2.getAuthInstance();
            let user = auth2.currentUser.get();
            if (!user) {
                error({'error': 'User not found.'});
                return false;
            }

            let profile = user.getBasicProfile();
            let authResponse = user.getAuthResponse(true);
            if (success) {
                success({
                    "accessToken": authResponse['access_token'],
                    "expires": authResponse['expires_at'],
                    "expires_in": authResponse['expires_in'],
                    "idToken": authResponse['id_token'],
                    "serverAuthCode": authResponse['server_auth_code'],
                    "email": profile.getEmail(),
                    "userId": profile.getId(),
                    "displayName": profile.getName(),
                    "familyName": profile.getFamilyName(),
                    "givenName": profile.getGivenName(),
                    "imageUrl": profile.getImageUrl()
                });
            }

        } else {
            if (error) error({'error': 'User not logged in.'});
        }
    },

    trySilentLogin: function (success, error, options) {
        if (!__googleSdkReady) {
            return __googleCallbacks.push(function() {
                this.trySilentLogin(success, error, options);
            });
        }

        GooglePlusProxy.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), success, error);
    },

    login: function (success, error, options) {
        let that = this;
        if (!__googleSdkReady) {
            return __googleCallbacks.push(function() {
                that.login(success, error, options);
            });
        }

        window.gapi.auth2.getAuthInstance().signIn(options).then(function () {
            GooglePlusProxy.updateSigninStatus(window.gapi.auth2.getAuthInstance().isSignedIn.get(), success, error);
        }, function(err) {
            error(err);
        });
    },

    logout: function (success, error) {
        if (!__googleSdkReady) {
            return __googleCallbacks.push(function() {
                this.logout(success, error);
            });
        }

        window.gapi.auth2.getAuthInstance().signOut().then(success, function(err) {
            error(err);
        });
    },

    disconnect: function (success, error) {
        if (!__googleSdkReady) {
            return __googleCallbacks.push(function() {
                this.disconnect(success, error);
            });
        }

        window.gapi.auth2.getAuthInstance().disconnect().then(success, function(err) {
            error(err);
        });
    },

    getSigningCertificateFingerprint: function (success, error) {
        console.warn('Not implemented.');
        console.trace();
    }
};

if (window.location.protocol === "file:") {
    console.warn("Google API is not supported when using file:// protocol");
} else {
    window.handleClientLoad = function() {
        window.gapi.load('auth2', function () {
            window.gapi.auth2.init({
                client_id: "81932177782-k78kjv5utgtrh5taoo9seg42q3a2bdp9.apps.googleusercontent.com"
            }).then(function () {
                __googleSdkReady = true;

                for (let i = 0; i < __googleCallbacks.length; i++) {
                    __googleCallbacks[i].call(GooglePlusProxy);
                }

                // Listen for sign-in state changes.
                window.gapi.auth2.getAuthInstance().isSignedIn.listen(GooglePlusProxy.updateSigninStatus);
            }, function(error) {
                if (error.details) {
                    console.error(error.details);
                } else {
                    console.error(error);
                }
            });
        });
    };

    (function(d, s, id){
        let js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
        js.onload = function () { window.handleClientLoad(); };
        js.onreadystatechange = function () { if (this.readyState === 'complete') js.onload(); };
        js.src = "https://apis.google.com/js/api.js";
        fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'googleplus-jssdk'));
}
