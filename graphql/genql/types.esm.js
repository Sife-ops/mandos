export default {
    "scalars": [
        1,
        2,
        5
    ],
    "types": {
        "Mutation": {
            "confirm": [
                1,
                {
                    "signupToken": [
                        2,
                        "String!"
                    ]
                }
            ],
            "resendEmail": [
                1,
                {
                    "email": [
                        2,
                        "String!"
                    ]
                }
            ],
            "signIn": [
                2,
                {
                    "email": [
                        2,
                        "String!"
                    ],
                    "password": [
                        2,
                        "String!"
                    ],
                    "serviceId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "signUp": [
                1,
                {
                    "email": [
                        2,
                        "String!"
                    ],
                    "password": [
                        2,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Boolean": {},
        "String": {},
        "Query": {
            "service": [
                4,
                {
                    "serviceId": [
                        2,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                2
            ]
        },
        "Service": {
            "logoUrl": [
                2
            ],
            "redirect": [
                2
            ],
            "serviceId": [
                5
            ],
            "title": [
                2
            ],
            "__typename": [
                2
            ]
        },
        "ID": {}
    }
}