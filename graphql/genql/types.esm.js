export default {
    "scalars": [
        1,
        4,
        7
    ],
    "types": {
        "CaptchaGet": {
            "captcha": [
                1
            ],
            "ts": [
                1
            ],
            "uuid": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "String": {},
        "CaptchaVerify": {
            "message": [
                1
            ],
            "ts": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "Mutation": {
            "captchaGet": [
                0
            ],
            "captchaVerify": [
                2,
                {
                    "captcha": [
                        1,
                        "String!"
                    ],
                    "uuid": [
                        1,
                        "String!"
                    ]
                }
            ],
            "changeAvatar": [
                8,
                {
                    "avatar": [
                        1,
                        "String!"
                    ]
                }
            ],
            "changePassword": [
                8,
                {
                    "password": [
                        1,
                        "String!"
                    ]
                }
            ],
            "changeUsername": [
                8,
                {
                    "username": [
                        1,
                        "String!"
                    ]
                }
            ],
            "confirm": [
                4,
                {
                    "registrationToken": [
                        1,
                        "String!"
                    ]
                }
            ],
            "resendEmail": [
                4,
                {
                    "email": [
                        1,
                        "String!"
                    ]
                }
            ],
            "resetPassword": [
                4,
                {
                    "password": [
                        1,
                        "String!"
                    ],
                    "registrationToken": [
                        1,
                        "String!"
                    ]
                }
            ],
            "sendResetEmail": [
                4,
                {
                    "email": [
                        1,
                        "String!"
                    ]
                }
            ],
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
                4,
                {
                    "email": [
                        1,
                        "String!"
                    ],
                    "password": [
                        1,
                        "String!"
                    ],
                    "username": [
                        1,
                        "String!"
                    ]
                }
            ],
            "__typename": [
                1
            ]
        },
        "Boolean": {},
        "Query": {
            "service": [
                6,
                {
                    "serviceId": [
                        1,
                        "String!"
                    ]
                }
            ],
            "user": [
                8
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
                7
            ],
            "title": [
                1
            ],
            "__typename": [
                1
            ]
        },
        "ID": {},
        "User": {
            "avatar": [
                1
            ],
            "confirmed": [
                4
            ],
            "discriminator": [
                1
            ],
            "email": [
                1
            ],
            "userId": [
                7
            ],
            "username": [
                1
            ],
            "__typename": [
                1
            ]
        }
    }
}