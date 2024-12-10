"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5003],{8284:(e,n,i)=>{i.r(n),i.d(n,{assets:()=>o,contentTitle:()=>c,default:()=>h,frontMatter:()=>r,metadata:()=>l,toc:()=>a});var t=i(4848),s=i(8453);const r={sidebar_position:1,sidebar_label:"IAuth Interface"},c="IAuth Interface",l={id:"interfaces/auth-interface",title:"IAuth Interface",description:"Overview",source:"@site/docs/interfaces/auth-interface.md",sourceDirName:"interfaces",slug:"/interfaces/auth-interface",permalink:"/sbt-aws/docs/interfaces/auth-interface",draft:!1,unlisted:!1,editUrl:"https://github.com/awslabs/sbt-aws/blob/main/website/docs/interfaces/auth-interface.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1,sidebar_label:"IAuth Interface"},sidebar:"interfaces",previous:{title:"SBT Interfaces",permalink:"/sbt-aws/docs/interfaces"},next:{title:"IBilling Interface",permalink:"/sbt-aws/docs/interfaces/billing-interface"}},o={},a=[{value:"Overview",id:"overview",level:2},{value:"Properties",id:"properties",level:2},{value:"jwtIssuer",id:"jwtissuer",level:3},{value:"jwtAudience",id:"jwtaudience",level:3},{value:"tokenEndpoint",id:"tokenendpoint",level:3},{value:"userClientId",id:"userclientid",level:3},{value:"machineClientId",id:"machineclientid",level:3},{value:"machineClientSecret",id:"machineclientsecret",level:3},{value:"machineClientAudience",id:"machineclientaudience",level:3},{value:"fetchTenantRegistrationScope",id:"fetchtenantregistrationscope",level:3},{value:"fetchAllTenantRegistrationsScope",id:"fetchalltenantregistrationsscope",level:3},{value:"deleteTenantRegistrationScope",id:"deletetenantregistrationscope",level:3},{value:"createTenantRegistrationScope",id:"createtenantregistrationscope",level:3},{value:"updateTenantRegistrationScope",id:"updatetenantregistrationscope",level:3},{value:"activateTenantRegistrationScope",id:"activatetenantregistrationscope",level:3},{value:"deactivateTenantRegistrationScope",id:"deactivatetenantregistrationscope",level:3},{value:"fetchUserScope",id:"fetchuserscope",level:3},{value:"fetchAllUsersScope",id:"fetchallusersscope",level:3},{value:"deleteUserScope",id:"deleteuserscope",level:3},{value:"createUserScope",id:"createuserscope",level:3},{value:"updateUserScope",id:"updateuserscope",level:3},{value:"disableUserScope",id:"disableuserscope",level:3},{value:"enableUserScope",id:"enableuserscope",level:3},{value:"wellKnownEndpointUrl",id:"wellknownendpointurl",level:3},{value:"createUserFunction",id:"createuserfunction",level:3},{value:"fetchAllUsersFunction",id:"fetchallusersfunction",level:3},{value:"fetchUserFunction",id:"fetchuserfunction",level:3},{value:"updateUserFunction",id:"updateuserfunction",level:3},{value:"deleteUserFunction",id:"deleteuserfunction",level:3},{value:"disableUserFunction",id:"disableuserfunction",level:3},{value:"enableUserFunction",id:"enableuserfunction",level:3},{value:"Methods",id:"methods",level:2},{value:"createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void",id:"createadminuserscope-construct-id-string-props-createadminuserprops-void",level:3},{value:"Usage",id:"usage",level:2}];function d(e){const n={code:"code",h1:"h1",h2:"h2",h3:"h3",header:"header",li:"li",p:"p",pre:"pre",ul:"ul",...(0,s.R)(),...e.components};return(0,t.jsxs)(t.Fragment,{children:[(0,t.jsx)(n.header,{children:(0,t.jsx)(n.h1,{id:"iauth-interface",children:"IAuth Interface"})}),"\n",(0,t.jsx)(n.h2,{id:"overview",children:"Overview"}),"\n",(0,t.jsx)(n.p,{children:"The IAuth interface encapsulates the properties and methods required for authentication and authorization in the application. It provides various configurations and endpoints related to JSON Web Tokens (JWT), OAuth, client IDs, client secrets, and scopes for different operations. Additionally, it includes Lambda functions for managing users."}),"\n",(0,t.jsx)(n.h2,{id:"properties",children:"Properties"}),"\n",(0,t.jsx)(n.h3,{id:"jwtissuer",children:"jwtIssuer"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string"}),"\n",(0,t.jsx)(n.li,{children:"Description: The JWT issuer domain for the identity provider. This is the domain where the JSON Web Tokens (JWTs) are issued from."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"jwtaudience",children:"jwtAudience"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string[]"}),"\n",(0,t.jsx)(n.li,{children:"Description: The list of recipients (audience) for which the JWT is intended. This will be checked by the API Gateway to ensure only authorized clients are provided access."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"tokenendpoint",children:"tokenEndpoint"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string"}),"\n",(0,t.jsx)(n.li,{children:"Description: The endpoint URL for granting OAuth tokens. This is the URL where OAuth tokens can be obtained from the authorization server."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"userclientid",children:"userClientId"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string"}),"\n",(0,t.jsx)(n.li,{children:"Description: The client ID enabled for user-centric authentication flows, such as Authorization Code flow. This client ID is used for authenticating end-users."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"machineclientid",children:"machineClientId"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string"}),"\n",(0,t.jsx)(n.li,{children:"Description: The client ID enabled for machine-to-machine authorization flows, such as Client Credentials flow. This client ID is used for authenticating applications or services."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"machineclientsecret",children:"machineClientSecret"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: SecretValue"}),"\n",(0,t.jsx)(n.li,{children:"Description: The client secret enabled for machine-to-machine authorization flows, such as Client Credentials flow. This secret is used in combination with the machine client ID for authenticating applications or services."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"machineclientaudience",children:"machineClientAudience"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The audience for the machine client. If provided, this value will be used in the call to generate the access token for the Client Credentials flow."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"fetchtenantregistrationscope",children:"fetchTenantRegistrationScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for fetching a single tenant registration. This scope grants permission to fetch the details of a specific tenant registration."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"fetchalltenantregistrationsscope",children:"fetchAllTenantRegistrationsScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for fetching all tenants. This scope grants permission to fetch the details of all tenants."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"deletetenantregistrationscope",children:"deleteTenantRegistrationScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for deleting a tenant registration. This scope grants permission to delete a specific tenant registration."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"createtenantregistrationscope",children:"createTenantRegistrationScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for creating a tenant registration. This scope grants permission to create a new tenant registration."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"updatetenantregistrationscope",children:"updateTenantRegistrationScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for updating a tenant registration. This scope grants permission to update the details of a specific tenant registration."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"activatetenantregistrationscope",children:"activateTenantRegistrationScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for activating a tenant via the tenant registration endpoint. This scope grants permission to activate a specific tenant."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"deactivatetenantregistrationscope",children:"deactivateTenantRegistrationScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for deactivating a tenant via the tenant registration endpoint. This scope grants permission to deactivate a specific tenant."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"fetchuserscope",children:"fetchUserScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for fetching a single user. This scope grants permission to fetch the details of a specific user."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"fetchallusersscope",children:"fetchAllUsersScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for fetching all users. This scope grants permission to fetch the details of all users."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"deleteuserscope",children:"deleteUserScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for deleting a user. This scope grants permission to delete a specific user."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"createuserscope",children:"createUserScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for creating a user. This scope grants permission to create a new user."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"updateuserscope",children:"updateUserScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for updating a user. This scope grants permission to update the details of a specific user."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"disableuserscope",children:"disableUserScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for disabling a user. This scope grants permission to disable a specific user."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"enableuserscope",children:"enableUserScope"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string | undefined"}),"\n",(0,t.jsx)(n.li,{children:"Description: The scope required to authorize requests for enabling a user. This scope grants permission to enable a specific user."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"wellknownendpointurl",children:"wellKnownEndpointUrl"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: string"}),"\n",(0,t.jsx)(n.li,{children:"Description: The well-known endpoint URL for the control plane identity provider. This URL provides configuration information about the identity provider, such as issuer, authorization endpoint, and token endpoint."}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"createuserfunction",children:"createUserFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for creating a user. (POST /users)"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"fetchallusersfunction",children:"fetchAllUsersFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for fetching all users. (GET /users)"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"fetchuserfunction",children:"fetchUserFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for fetching a user. (GET /user/{userId})"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"updateuserfunction",children:"updateUserFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for updating a user. (PUT /user/{userId})"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"deleteuserfunction",children:"deleteUserFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for deleting a user. (DELETE /user/{userId})"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"disableuserfunction",children:"disableUserFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for disabling a user. (PUT /user/{userId}/disable)"}),"\n"]}),"\n",(0,t.jsx)(n.h3,{id:"enableuserfunction",children:"enableUserFunction"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Type: IFunction"}),"\n",(0,t.jsx)(n.li,{children:"Description: The Lambda function for enabling a user. (PUT /user/{userId}/enable)"}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"methods",children:"Methods"}),"\n",(0,t.jsx)(n.h3,{id:"createadminuserscope-construct-id-string-props-createadminuserprops-void",children:"createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"Description: Function to create an admin user."}),"\n",(0,t.jsxs)(n.li,{children:["Parameters:","\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"scope (Construct): The scope in which the admin user should be created."}),"\n",(0,t.jsx)(n.li,{children:"id (string): The unique identifier for the admin user."}),"\n",(0,t.jsx)(n.li,{children:"props (CreateAdminUserProps): An object containing the properties for creating the admin user."}),"\n"]}),"\n"]}),"\n"]}),"\n",(0,t.jsx)(n.p,{children:"The CreateAdminUserProps interface has the following properties:"}),"\n",(0,t.jsxs)(n.ul,{children:["\n",(0,t.jsx)(n.li,{children:"name (string): The name of the new admin user."}),"\n",(0,t.jsx)(n.li,{children:"email (string): The email address of the new admin user."}),"\n",(0,t.jsx)(n.li,{children:"role (string): The name of the role of the new admin user."}),"\n"]}),"\n",(0,t.jsx)(n.h2,{id:"usage",children:"Usage"}),"\n",(0,t.jsx)(n.p,{children:"To use the IAuth interface, you'll need to implement it and provide the required configurations and Lambda functions. Here's an example of how you might use it:"}),"\n",(0,t.jsx)(n.pre,{children:(0,t.jsx)(n.code,{className:"language-typescript",children:"import { IAuth, CreateAdminUserProps } from './auth-interface';\n\nclass MyAuth implements IAuth {\n  // Implement the properties and methods of the IAuth interface\n  // ...\n\n  createAdminUser(scope: Construct, id: string, props: CreateAdminUserProps): void {\n    // Implement the logic to create an admin user\n    // ...\n  }\n}\n\nconst myAuth = new MyAuth();\n\n// Use the properties and methods of the IAuth interface\nconst jwtIssuer = myAuth.jwtIssuer;\nconst tokenEndpoint = myAuth.tokenEndpoint;\n\n// Create an admin user\nconst adminUserProps: CreateAdminUserProps = {\n  name: 'John Doe',\n  email: 'john.doe@example.com',\n  role: 'Admin',\n};\nmyAuth.createAdminUser(this, 'AdminUser', adminUserProps);\n"})})]})}function h(e={}){const{wrapper:n}={...(0,s.R)(),...e.components};return n?(0,t.jsx)(n,{...e,children:(0,t.jsx)(d,{...e})}):d(e)}},8453:(e,n,i)=>{i.d(n,{R:()=>c,x:()=>l});var t=i(6540);const s={},r=t.createContext(s);function c(e){const n=t.useContext(r);return t.useMemo((function(){return"function"==typeof e?e(n):{...n,...e}}),[n,e])}function l(e){let n;return n=e.disableParentContext?"function"==typeof e.components?e.components(s):e.components||s:c(e.components),t.createElement(r.Provider,{value:n},e.children)}}}]);