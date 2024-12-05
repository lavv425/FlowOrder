module.exports = {
    apps: [
        {
            name: "flow_order_backend_v1",
            script: "server.php",
            watch: true,
            ignore_watch: ["node_modules", "logs"],
            exec_mode: "fork",
            instances: 1,
            env: {
                PORT: 3005,
                NODE_ENV: "production"
            },
            autorestart: true,
            max_restarts: 5,
            restart_delay: 5000
        }
    ]
};