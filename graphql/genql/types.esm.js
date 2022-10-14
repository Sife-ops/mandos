export default {
    "scalars": [
        1,
        2,
        5
    ],
    "types": {
        "Mutation": {
            "signIn": [
                1,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ],
                    "serviceId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "signUp": [
                2,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "Boolean": {},
        "Query": {
            "service": [
                4,
                {
                    "serviceId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "Service": {
            "logoUrl": [
                1
            ],
            "redirect": [
                1
            ],
            "serviceId": [
                5
            ],
            "title": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ID": {}
    }
}