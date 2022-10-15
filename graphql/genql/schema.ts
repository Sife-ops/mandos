import {FieldsSelection,Observable} from '@genql/runtime'

export type Scalars = {
    Boolean: boolean,
    String: string,
    ID: string,
}

export interface Mutation {
    confirm: Scalars['Boolean']
    signIn: Scalars['String']
    signUp: Scalars['Boolean']
    __typename: 'Mutation'
}

export interface Query {
    service: Service
    __typename: 'Query'
}

export interface Service {
    logoUrl: Scalars['String']
    redirect: Scalars['String']
    serviceId: Scalars['ID']
    title: Scalars['String']
    __typename: 'Service'
}

export interface MutationRequest{
    confirm?: [{signupToken: Scalars['String']}]
    signIn?: [{email: Scalars['String'],password: Scalars['String'],serviceId: Scalars['String']}]
    signUp?: [{email: Scalars['String'],password: Scalars['String']}]
    __typename?: boolean | number
    __scalar?: boolean | number
}

export interface QueryRequest{
    service?: [{serviceId: Scalars['String']},ServiceRequest]
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


export interface MutationPromiseChain{
    confirm: ((args: {signupToken: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>}),
    signIn: ((args: {email: Scalars['String'],password: Scalars['String'],serviceId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['String']) => Promise<Scalars['String']>}),
    signUp: ((args: {email: Scalars['String'],password: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Promise<Scalars['Boolean']>})
}

export interface MutationObservableChain{
    confirm: ((args: {signupToken: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>}),
    signIn: ((args: {email: Scalars['String'],password: Scalars['String'],serviceId: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['String']) => Observable<Scalars['String']>}),
    signUp: ((args: {email: Scalars['String'],password: Scalars['String']}) => {get: (request?: boolean|number, defaultValue?: Scalars['Boolean']) => Observable<Scalars['Boolean']>})
}

export interface QueryPromiseChain{
    service: ((args: {serviceId: Scalars['String']}) => ServicePromiseChain & {get: <R extends ServiceRequest>(request: R, defaultValue?: FieldsSelection<Service, R>) => Promise<FieldsSelection<Service, R>>})
}

export interface QueryObservableChain{
    service: ((args: {serviceId: Scalars['String']}) => ServiceObservableChain & {get: <R extends ServiceRequest>(request: R, defaultValue?: FieldsSelection<Service, R>) => Observable<FieldsSelection<Service, R>>})
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