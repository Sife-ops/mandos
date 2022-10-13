export default {
    "scalars": [
        1,
        2
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
            "hello": [
                1
            ],
            "__typename": [
                1
            ]
        }
    }
}