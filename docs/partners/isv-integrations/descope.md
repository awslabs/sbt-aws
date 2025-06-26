# Introduction

The Descope Plugin for SBT-AWS empowers SaaS developers with a highly flexible, secure, and developer-friendly authentication solution, designed to seamlessly integrate with the AWS SaaS Builder Toolkit (SBT). Descope allows you to quickly implement custom authentication, machine-to-machine (M2M) authentication, and comprehensive user management— transforming the way you handle identity and access for your SaaS applications. With Descope, you get not only a comprehensive set of authentication tools but also an environment that makes it incredibly easy to build and iterate on SaaS applications across all AWS services. Key Features and Benefits:

* Custom Flows for Tailored User Experiences: Descope allows you to design custom authentication flows specific to your application’s needs. Using a drag & drop workflow interface, you can create varied user journeys that improve user onboarding and retention, secure accounts against credential-based threats, and save time for engineering and IT teams . This no-code configuration removes the need for complex coding, allowing you to focus on creating seamless user experiences.
* Machine-to-Machine (M2M) Authentication: Descope supports secure, straightforward M2M authentication, enabling easy communication between devices, APIs, and automated services. With minimal setup, Descope makes M2M workflows intuitive and greatly reduces development time, allowing you to enable seamless interactions for API-to-API connections or other automated service exchanges within your application.
* Granular Access Control: Descope fine grained authorization capabilities with role and relationship-based access control allow you to align access policies with precise business requirements, ensuring secure and accurate user access. This flexibility is ideal for SaaS applications serving diverse user types and organizations with varied permission structures.
* Enhanced Security with MFA and Passwordless Options: Descope empowers you to add multiple layers of security with minimal setup. Offering MFA and passwordless authentication options, Descope lets users select their preferred security approach, keeping accounts safe without compromising on user experience. These options help developers maintain the highest security standards without adding undue friction that may cause drop-offs.
* Simplified User and Tenant Management: Descope’s built-in tools support user segmentation and tenant-based configurations, making it easy to manage authentication across different customers and organizations. This setup is ideal for SaaS applications with multiple tenants, allowing you to create and manage tenant-specific configurations with ease, enhancing both security and customization.
* Seamless Integration with AWS and SBT: Descope integrates effortlessly within the AWS ecosystem, including the SaaS Builder Toolkit (SBT). By leveraging Descope as an SBT plugin, you can streamline authentication and authorization across your entire suite of AWS-powered SaaS applications. This compatibility ensures that Descope works harmoniously with other AWS services, so you can iterate quickly and deploy efficiently without worrying about compatibility or performance issues. This integration makes Descope a highly adaptable solution for any SaaS platform aiming to leverage the best of AWS while enhancing user management capabilities.
* Excellent Developer Experience: Descope makes authentication setup simple, with no-code/low-code interfaces and a flow editor that lets you modify user journeys without touching your codebase or redeploying your app. Seamless CI/CD integration keeps your development process streamlined, and comprehensive self-service resources—including documentation and community support—ensure developers have the guidance they need. This efficiency accelerates deployment while maintaining high security standards and freeing up engineering time for other core product initiatives.

# Use Cases:

1. Customer Authentication and Access Control: Support diverse passwordless login options—including social, Google One Tap, passkeys, and magic links—to enhance user experience and secure control over data and resources.
2. B2B Multi-Tenant SaaS: Enable granular, tenant-specific authentication and access policies, supporting unique identity needs per organization and ensuring data isolation and compliance across clients.
3. Strong, Adaptive MFA: Provide adaptive multi-factor authentication (MFA) options to secure critical user actions, reducing fraud and enhancing security with minimal friction for legitimate users.
4. Machine-to-Machine (M2M) Authentication: Establish secure, automated communication between services and devices with simple M2M authentication setups, ideal for integrating APIs or IoT devices.
5. SSO and Self-Service SSO Configuration: Allow tenant administrators to self-configure single sign-on (SSO) for their organization, making it easy for them to manage access without burdening your support team.

# Installation instructions

## Prerequisites[​](#prerequisites "Direct link to Prerequisites")

* Ensure you have a Descope account. If not, sign up [here](https://www.descope.com/sign-up)
* Have access to a [Descope Project](https://app.descope.com/settings/project), as well as a [Management Key](https://app.descope.com/settings/company/managementkeys)
* Set up an AWS SBT Project [here](https://github.com/awslabs/sbt-aws/tree/main/docs/public)

## Obtaining the Plugin[​](#obtaining-the-plugin "Direct link to Obtaining the Plugin")

**Option 1: Import directly from npm**

Within your SBT project directory, install sbt-aws-descope via the following command:

```
npm install --save @descope/sbt-aws-descope
```

**Option 2: Download the latest release**

Visit the GitHub releases page and download the latest version.

## Installation Steps[​](#installation-steps "Direct link to Installation Steps")

a. Follow the prerequisite steps to get started with the installation of this plugin. b. Clone the repo of the plugin provided. c. Install the Descope plugin's npm package within the SBT project downloaded as part of the prerequisites. d. Add `DescopeAuth` as part of your SBT's Control Plane construct. This way, SBT will use Descope as the identity provider, which implements the IAuth interface defined in the SBT core package.

## Configuration[​](#configuration "Direct link to Configuration")

**Step 1**: Follow the prerequisite steps to prepare for plugin installation.

**Step 2**: Clone the plugin repository as provided in the options above.

**Step 3**: Install the Descope plugin's npm package within the SBT project:

```
npm install @descope/sbt-aws-descope
```

**Step 4**: Integrate DescopeAuth within your SBT’s Control Plane construct to enable Descope as the identity provider, implementing the IAuth interface as defined in the SBT core package.

```
import { DescopeAuth } from "sbt-aws-descope";

const descopeAuth = new DescopeAuth(this, "DescopeAuth", {
      projectId: "<<Descope Project ID>>",
      clientSecretSSMMgmtKey: "<<Parameter Name in SSM of Descope Management Key",
});

const controlPlane = new sbt.ControlPlane(this, "ControlPlane", {
      auth: descopeAuth,
      systemAdminEmail: "kevin@descope.com",
});
```

Once you’ve completed these steps, you should be able to build your SBT application and all of the built in functions will be set up for you. If you wish to add Flows or SDK/API based authentication methods to your app, you can follow our [Quickstart](https://docs.descope.com/getting-started) guide.

**Step 5**: Usage Examples

* ### Example 1: Implementing User Login with Passwordless Authentication Using Descope[​](#example-1-implementing-user-login-with-passwordless-authentication-using-descope "Direct link to Example 1: Implementing User Login with Passwordless Authentication Using Descope")

Descope's passwordless authentication provides a flexible, highly secure way to log in without traditional passwords, reducing the risk of phishing attacks and enhancing user convenience. With Descope, you can offer users a range of secure, passwordless login options, including passkeys, social login, and magic links—all of which improve security while simplifying the user experience.

* **Passkeys**: Passkeys use a combination of device-based biometric verification (like fingerprint or Face ID) and cryptographic methods to authenticate users. This approach allows users to log in using only their device, without needing to enter any passwords. Implementing passkeys with Descope is straightforward, requiring only the user's consent to set up the device-based authentication. Passkeys are stored securely on the user's device, providing a phishing-resistant method of authentication that is seamless and familiar.
* **Social Login**: Descope supports a variety of social login providers, allowing users to authenticate via platforms they already use, like Google, Apple, or Facebook. This method enhances convenience while still ensuring a secure authentication process, as it reduces the need to create and remember yet another password.
* **Magic Link**: Magic links provide users with a one-time link sent directly to their email. When clicked, it logs the user in without requiring a password, making the process not only user-friendly but also resistant to phishing attacks. Since magic links are sent to the user's verified email, they ensure that the person logging in is indeed the account holder.

**Benefits**: Descope's passwordless options help prevent phishing by eliminating traditional passwords and offering cryptographic alternatives that are more secure. The variety of login methods allows you to choose the best option based on your application's user demographics and risk model, ensuring both security and convenience.

* ### Example 2: Configuring multi-tenant user management to allow organization-specific login settings and access policies[​](#example-2-configuring-multi-tenant-user-management-to-allow-organization-specific-login-settings-and-access-policies "Direct link to Example 2: Configuring multi-tenant user management to allow organization-specific login settings and access policies")

In a multi-tenant SaaS environment, organizations often have unique authentication needs, such as specific Single Sign-On (SSO) policies, access roles, and authorization rules. Descope enables you to manage each organization separately, providing customized login settings and role-based access control for each tenant.

* **SSO Self-Service Configuration**: Descope enables tenant admins to configure SSO independently through a dedicated link. Once generated, this link lets an admin configure SSO settings, such as setting up SAML or OAuth integrations, without needing assistance from developers.

  <!-- -->

  * **Example Workflow**:

    <!-- -->

    1. You can generate a self-service SSO link specific to the tenant, which can be shared with the tenant admin.
    2. **Tenant Admin SSO Configuration**: When the tenant admin accesses the link, they can complete the setup of SSO by following simple on-screen instructions. They can choose their identity provider, configure SAML assertions, and save the settings, allowing users within that tenant to log in through their chosen provider.

* **Role-Based Access Control (RBAC)**: With Descope's tenant-level RBAC, you can assign users different roles based on the tenant's requirements, as well as map them from SAML groups that come from various external IdPs. For example, some users might have admin access, while others have read-only access. These roles can be configured on a per-tenant basis, allowing for flexible access control.

* **Custom Tenant Authentication**: Descope lets you configure different flow behaviors and styling per tenant, including MFA requirements, password settings, and device trust. This allows you to implement granular security controls based on the tenant's risk profile, such as requiring MFA for certain users.

## Troubleshooting[​](#troubleshooting "Direct link to Troubleshooting")

**Common Issues and Solutions**:

* **Issue**: "User Management functions or Initial SBT plugin setup and configuration failing."
  <!-- -->
  * **Solution**: Verify your Descope Management Key and permissions.
* **Issue**: "Access denied errors when accessing SBT control plane."
  <!-- -->
  * **Solution**: Ensure the Descope plugin is properly installed and referenced in your SBT configuration.

Additional Support: For detailed support, please refer to [Descope Support](https://docs.descope.com/support).

## Contributing[​](#contributing "Direct link to Contributing")

If you would like to contribute to the development of this plugin, please refer to our contribution guidelines on GitHub. Contributions are welcome and encouraged to improve functionality and usability.

### Architecture Diagram[​](#architecture-diagram "Direct link to Architecture Diagram")

* Example:

![descopearch.png](/sbt-aws/assets/images/descopearch-1354eea4eaefcf52bf9ee00519a69a93.png)
