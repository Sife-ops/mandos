import {FieldsSelection,Observable} from '@genql/runtime'

export type Scalars = {
    String: string,
    Boolean: boolean,
    ID: string,
}

export interface CaptchaGet {
    captcha: Scalars['String']
    ts: Scalars['String']
    uuid: Scalars['String']
    __typename: 'CaptchaGet'
}

export interface CaptchaVerify {
    message: Scalars['String']
    ts: Scalars['String']
    __typename: 'CaptchaVerify'
}

export interface Mutation {
    captchaGet: CaptchaGet
    captchaVerify: CaptchaVerify
    changeAvatar: Scalars['Boolean']
    changePassword: Scalars['Boolean']
    changeUsername: Scalars['Boolean']
    confirm: Scalars['Boolean']
    resendEmail: Scalars['Boolean']
    resetPassword: Scalars['Boolean']
    sendResetEmail: Scalars['Boolean']
    signIn: Scalars['String']
    signUp: Scalars['Boolean']
    __typename: 'Mutation'
}

export interface Query {
    service: Service
    user: User
    __typename: 'Query'
}

export interface Service {
    logoUrl: Scalars['String']
    redirect: Scalars['String']
    serviceId: Scalars['ID']
    title: Scalars['String']
    __typename: 'Service'
}

export interface User {
    avatarUrl: Scalars['String']
    confirmed: Scalars['Boolean']
    discriminator: Scalars['String']
    email: Scalars['String']
    userId: Scalars['ID']
    username: Scalars['String']
    __typename: 'User'
}

export interface CaptchaGetRequest{
    captcha?: boolean | number
    ts?: boolean | number
    uuid?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface CaptchaVerifyRequest{
    message?: boolean | number
    ts?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface MutationRequest{
    captchaGet?: CaptchaGetRequest
    captchaVerify?: [{captcha: Scalars['String'],uuid: Scalars['String']},CaptchaVerifyRequest]
    changeAvatar?: [{avatar: Scalars['String']}]
    changePassword?: [{password: Scalars['String']}]
    changeUsername?: [{username: Scalars['String']}]
    confirm?: [{registrationToken: Scalars['String']}]
    resendEmail?: [{email: Scalars['String']}]
    resetPassword?: [{password: Scalars['String'],registrationToken: Scalars['String']}]
    sendResetEmail?: [{email: Scalars['String']}]
    signIn?: [{email: Scalars['String'],password: Scalars['String'],serviceId: Scalars['String']}]
    signUp?: [{email: Scalars['String'],password: Scalars['String'],username: Scalars['String']}]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryRequest{
    service?: [{serviceId: Scalars['String']},ServiceRequest]
    user?: UserRequest
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface ServiceRequest{
    logoUrl?: boolean | number
    redirect?: boolean | number
    serviceId?: boolean | number
    title?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface UserRequest{
    avatarUrl?: boolean | number
    confirmed?: boolean | number
    discriminator?: boolean | number
    email?: boolean | number
    userId?: boolean | number
    username?: boolean | number
    __typename?: boolean | number
    __scalar?: boolean | number
}


const CaptchaGet_possibleTypes: string[] = ['CaptchaGet']
export const isCaptchaGet = (obj?: { __typename?: any } | null): obj is CaptchaGet => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isCaptchaGet"')
  return CaptchaGet_possibleTypes.includes(obj.__typename)
}



const CaptchaVerify_possibleTypes: string[] = ['CaptchaVerify']
export const isCaptchaVerify = (obj?: { __typename?: any } | null): obj is CaptchaVerify => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isCaptchaVerify"')
  return CaptchaVerify_possibleTypes.includes(obj.__typename)
}



const Mutation_possibleTypes: string[] = ['Mutation']
export const isMutation = (obj?: { __typename?: any } | null): obj is Mutation => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isMutation"')
  return Mutation_possibleTypes.includes(obj.__typename)
}



const Query_possibleTypes: string[] = ['Query']
export const isQuery = (obj?: { __typename?: any } | null): obj is Query => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isQuery"')
  return Query_possibleTypes.includes(obj.__typename)
}



const Service_possibleTypes: string[] = ['Service']
export const isService = (obj?: { __typename?: any } | null): obj is Service => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isService"')
  return Service_possibleTypes.includes(obj.__typename)
}



const User_possibleTypes: string[] = ['User']
export const isUser = (obj?: { __typename?: any } | null): obj is User => {
  if (!obj?.__typename) throw new Error('__typename is missing in "isUser"')
  return User_possibleTypes.includes(obj.__typename)
}


export interface CaptchaGetPromiseChain{
    captcha: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    ts: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    uuid: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface CaptchaGetObservableChain{
    captcha: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    ts: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    uuid: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}

export interface CaptchaVerifyPromiseChain{
    message: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    ts: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface CaptchaVerifyObservableChain{
    message: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    ts: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}

export interface MutationPromiseChain{
    captchaGet: (CaptchaGetPromiseChain & {get: <R extends CaptchaGetRequest>(request: R, defaultValue?: FieldsSelection<CaptchaGet, R>) => Promise<FieldsSelection<CaptchaGet, R>>}),
    captchaVerify: ((args: {captcha: Scalars['String'],uuid: Scalars['String']}) => CaptchaVerifyPromiseChain & {get: <R extends CaptchaVerifyRequest>(request: R, defaultValue?: FieldsSelection<CaptchaVerify, R>) => Promise<FieldsSelection<CaptchaVerify, R>>}),
    changeAvatar: ((args: {avatar: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    changePassword: ((args: {password: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    changeUsername: ((args: {username: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    confirm: ((args: {registrationToken: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    resendEmail: ((args: {email: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    resetPassword: ((args: {password: Scalars['String'],registrationToken: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    sendResetEmail: ((args: {email: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    signIn: ((args: {email: Scalars['String'],password: Scalars['String'],serviceId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    signUp: ((args: {email: Scalars['String'],password: Scalars['String'],username: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>})
}

export interface MutationObservableChain{
    captchaGet: (CaptchaGetObservableChain & {get: <R extends CaptchaGetRequest>(request: R, defaultValue?: FieldsSelection<CaptchaGet, R>) => Observable<FieldsSelection<CaptchaGet, R>>}),
    captchaVerify: ((args: {captcha: Scalars['String'],uuid: Scalars['String']}) => CaptchaVerifyObservableChain & {get: <R extends CaptchaVerifyRequest>(request: R, defaultValue?: FieldsSelection<CaptchaVerify, R>) => Observable<FieldsSelection<CaptchaVerify, R>>}),
    changeAvatar: ((args: {avatar: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    changePassword: ((args: {password: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    changeUsername: ((args: {username: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    confirm: ((args: {registrationToken: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    resendEmail: ((args: {email: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    resetPassword: ((args: {password: Scalars['String'],registrationToken: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    sendResetEmail: ((args: {email: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    signIn: ((args: {email: Scalars['String'],password: Scalars['String'],serviceId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    signUp: ((args: {email: Scalars['String'],password: Scalars['String'],username: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>})
}

export interface QueryPromiseChain{
    service: ((args: {serviceId: Scalars['String']}) => ServicePromiseChain & {get: <R extends ServiceRequest>(request: R, defaultValue?: FieldsSelection<Service, R>) => Promise<FieldsSelection<Service, R>>}),
    user: (UserPromiseChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Promise<FieldsSelection<User, R>>})
}

export interface QueryObservableChain{
    service: ((args: {serviceId: Scalars['String']}) => ServiceObservableChain & {get: <R extends ServiceRequest>(request: R, defaultValue?: FieldsSelection<Service, R>) => Observable<FieldsSelection<Service, R>>}),
    user: (UserObservableChain & {get: <R extends UserRequest>(request: R, defaultValue?: FieldsSelection<User, R>) => Observable<FieldsSelection<User, R>>})
}

export interface ServicePromiseChain{
    logoUrl: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    redirect: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    serviceId: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Promise<Scalars['ID']>}),
    title: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface ServiceObservableChain{
    logoUrl: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    redirect: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    serviceId: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Observable<Scalars['ID']>}),
    title: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}

export interface UserPromiseChain{
    avatarUrl: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    confirmed: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    discriminator: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    email: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Promise<Scalars['ID']>}),
    username: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>})
}

export interface UserObservableChain{
    avatarUrl: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    confirmed: ({get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    discriminator: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    email: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    userId: ({get: (request?: boolean|number, defaultValue?: Scalars['ID']) => Observable<Scalars['ID']>}),
    username: ({get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>})
}