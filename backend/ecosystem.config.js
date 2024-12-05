module.exports = {
    apps: [
        {
            name: "flow_order_backend_v1",
            script: "server.php",
            watch: true,
            ignore_watch: ["node_modules", "logs"],
            exec_mode: "fork",
            env: {
                PORT: 3005,
                NODE_ENV: "production"
            }
        }
    ]
};