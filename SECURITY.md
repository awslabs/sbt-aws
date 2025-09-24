# Security Policy

## Supported Versions

We actively support the following versions of SBT-AWS with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.x.x   | :white_check_mark: |

## Reporting a Vulnerability

The SBT-AWS team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose your findings.

### How to Report

Please **do not** report security vulnerabilities through public GitHub issues.

Instead, please report security vulnerabilities by:

1. **Email**: Send details to `sbt-aws-maintainers@amazon.com`
2. **Include**: 
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)

### What to Expect

- **Acknowledgment**: We will acknowledge receipt of your vulnerability report within 2 business days
- **Initial Response**: We will provide an initial response within 5 business days
- **Updates**: We will keep you informed of our progress
- **Resolution**: We aim to resolve critical vulnerabilities within 30 days

### Security Best Practices

When using SBT-AWS:

1. **Keep Dependencies Updated**: Regularly update to the latest version
2. **Enable Advanced Security**: Use `enableAdvancedSecurityMode: true` in production
3. **Follow AWS Security Best Practices**: Implement proper IAM policies and VPC configurations
4. **Monitor Dependencies**: Use tools like `npm audit` to check for vulnerabilities
5. **Secure Configuration**: Review all configuration options for security implications

### Vulnerability Disclosure Policy

- We will work with you to understand and resolve the issue
- We will acknowledge your contribution in our security advisories (unless you prefer to remain anonymous)
- We will coordinate disclosure timing with you
- We will not pursue legal action against researchers who follow responsible disclosure

## Security Features

SBT-AWS includes several security features:

- **Cognito Advanced Security**: Enabled by default in production
- **VPC Isolation**: Network-level tenant isolation
- **IAM Integration**: Fine-grained access control
- **Encryption**: Data encryption at rest and in transit
- **Security Groups**: Restrictive network access by default

## Dependencies

We actively monitor our dependencies for security vulnerabilities using:

- Dependabot for automated security updates
- Regular security audits
- Community vulnerability reports

Thank you for helping keep SBT-AWS and our users safe!