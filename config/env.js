const ENV = {
    // Base URL yang akan ditest 
    baseUrl: 'https://https://www.saucedemo.com/',

    users: {
        valid: {
            username: 'standard_user',
            password: 'secret_sauce'
        },
        invalidUsername: {
            username: 'invalid_user',
            password: 'secret_sauce'
        },
        invalidPassword: {
            username: 'standard_user',
            password: 'invalid_password'
        },
        lockedOut: {
            username: 'locked_out_user',
            password: 'secret_sauce'
        },
        problem: {
            username: 'problem_user',
            password: 'secret_sauce'
        },
        performance: {
            username: 'performance_glitch_user',
            password: 'secret_sauce'
        }

    },

    //expected values untuk assertions 
    expected: {
        loginSuccessTitle: "Products",
        invalidCredentialsError: "Username and password do not match",
        lockedOutError: "locked out",
        emptyCredentialsError: "Username is required"
    },

    //Timeouts dalam milliseconds
    timeouts: {
        implicitWait: 10000,
        explicitWait: 5000,
        pageLoadTimeout: 30000
    }
};

module.exports = ENV; 