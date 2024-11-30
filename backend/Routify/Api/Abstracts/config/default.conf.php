<?php
return [
    "responses" => [
        "success" => [
            "status" => true,
            "message" => "Operation completed successfully",
            "data" => [],
            "error" => [],
        ],
        "error" => [
            "status" => false,
            "message" => "An error occurred",
            "data" => [],
            "error" => [
                "message" => "An error occurred while processing the request",
            ],
        ],
        "bad_request" => [
            "status" => false,
            "message" => "Bad request",
            "data" => [],
            "error" => [
                "message" => "The client made a bad request to the server",
            ],
        ],
        "not_found" => [
            "status" => false,
            "message" => "Resource not found",
            "data" => [],
            "error" => [
                "message" => "The client requested a non-existent (or moved) resource",
            ],
        ],
        "not_auth" => [
            "status" => false,
            "message" => "Unauthorized request",
            "data" => [],
            "error" => [
                "message" => "You're not allowed to access this resource",
            ],
        ],
        "forbidden" => [
            "status" => false,
            "message" => "You don't have the permission to access the requested resource",
            "data" => [],
            "error" => [
                "message" => "You don't have the permission to access the requested resource",
            ],
        ],
        "method_not_allowed" => [
            "status" => false,
            "message" => "Used method not allowed",
            "data" => [],
            "error" => [
                "message" => "The method you called is not allowed on the requested resource",
            ],
        ],
        "validation_error" => [
            "status" => false,
            "message" => "Validation error",
            "data" => [],
            "error" => [
                "message" => "The data you passed didn't satisfy validation requirments",
            ],
        ],
    ],
    "http_status_codes" => [
        "success" => 200,
        "error" => 500,
        "bad_request" => 400,
        "not_found" => 404,
        "not_auth" => 401,
        "forbidden" => 403,
        "method_not_allowed" => 405,
        "validation_error" => 422,
    ]
];
