module.exports = {
    bcrypt: {
        saltRounds: 10
    },
    admin_pass: "password",
    admin_email: "admin@flatlogic.com",
    secret_key: "HUEyqESqgQ1yTwzVlO6wprC9Kf1J1xuA",
    host: process.env.HOST || "http://localhost",
    port: process.env.NODE_ENV === "production" ? "" : "8080",
    hostUI: process.env.NODE_ENV === "production" ? "https://joulon-flatlogic.herokuapp.com" : "http://localhost",
    portUI: process.env.NODE_ENV === "production" ? "" : "3000",
    google: {
        clientId: "550305867116-t23pvpji8jaioffteu3kev2pob9fcpu8.apps.googleusercontent.com",
        clientSecret: "a4MkhjaOYZb46N-ECfGPQEId"
    },
    microsoft: {
        clientId: "36fa2f05-15e8-4249-8817-bc1c2db325c6",
        clientSecret: "NDxdF1-%nKVj2^KsFsJHh{twNR;l"
    }
};