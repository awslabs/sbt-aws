---
sidebar_position: 1
---
# Amazon EKS SaaS Reference Architecture

**[Feedback & Feature request](https://www.pulse.aws/survey/XHZBD2KH)** 

The code provide here is intended to provide a sample implementation of a SaaS Amazon EKS solution. The goal is to provide SaaS developers and architects with working code that will illustrate how multi-tenant SaaS applications can be design and delivered on AWS. The solution covers a broad range of multi-tenant considerations, including tenant isolation, identity, data partitioning, and deployment. It provides developers with a prescriptive approach the fundamentals of building SaaS solution with EKS. The focus here is more on giving developers a view into the working elements of the solution without going to the extent of making a full, production-ready solution. Instead, we're hoping this can jump start your process and address some of the common challenges that teams must address when delivering a SaaS solution with EKS.

Note that the instructions below are intended to give you step-by-step, how-to instructions for getting this solution up and running in your own AWS account. For a general description and overview of the solution, please see the [developer's guide here](GUIDE.md).

## Setting up the environment

> :warning: The Cloud9 workspace should be built by an IAM user with Administrator privileges, not the root account user. Please ensure you are logged in as an IAM user, not the root account user.

1. Create new Cloud9 Environment
    * Launch Cloud9 in your closest region Ex: `https://us-west-2.console.aws.amazon.com/cloud9/home?region=us-west-2`
    * Select Create environment
    * Name it whatever you want, click Next.
    * Choose “t3.small” for instance type, take all default values and click Create environment
2. Create EC2 Instance Role
    * Follow this [deep link](https://console.aws.amazon.com/iam/home#/roles$new?step=review&commonUseCase=EC2%2BEC2&selectedUseCase=EC2&policies=arn:aws:iam::aws:policy%2FAdministratorAccess) to create an IAM role with Administrator access.
    * Confirm that AWS service and EC2 are selected, then click Next to view permissions.* Confirm that AdministratorAccess is checked, then click `Next: Tags` to assign tags.
    * Take the defaults, and click `Next: Review` to review.
    * Enter `eks-ref-arch-admin` for the Name, and click `Create role`.
3. Remove managed credentials and attach EC2 Instance Role to Cloud9 Instance
    * Click the gear in the upper right-hand corner of the IDE which opens settings. Click the `AWS Settings` on the left and under `Credentials` slide the button to the left for `AWS Managed Temporary Credentials. The button should be greyed out when done with an x to the right indicating it's off.
    * Click the round Button with an alphabet in the upper right-hand corner of the IDE and click `Manage EC2 Instance`. This will take you the EC2 portion of the AWS Console
    * Right-click the EC2 instance and in the fly-out menu, click `Security` -> `Modify IAM Role`
    * Choose the Role you created in step 3 above. It should be titled "eks-ref-arch-admin" and click `Save`.
4. Clone the repo and run the setup script
    * Return to the Cloud9 IDE
    * In the upper left part of the main screen, click the round green button with a `+` on it and click `New Terminal`
    * Enter the following in the terminal window

    ```bash
    git clone https://github.com/aws-samples/aws-saas-factory-eks-reference-architecture
    cd aws-saas-factory-eks-reference-architecture
    chmod +x setup.sh
    ./setup.sh
   ```

   This [script](./setup.sh) sets up all Kubernetes tools, updates the AWS CLI and installs other dependencies that we'll use later. Take note of the final output of this script. If everything worked correctly, you should see the message that the you're good to continue creating the EKS cluster. If you do not see this message, please do not continue. Ensure that the Administrator EC2 role was created and successfully attached to the EC2 instance that's running your Cloud9 IDE. Also ensure you turned off `AWS Managed Credentials` inside your Cloud9 IDE (refer to step 3).


5. Deploying the solution

    **OPTION 1: Without custom domain**
    * If you don't have a custom domain, execute the below command by providing an email Id. This email address will be used by the SaaS administrator to login to the "Admin" application. A temporary password will be sent to this email address.

    ```bash
    ./scripts/install.sh <email address of admin user>
    ```

    **OPTION 2: With custom domain**

    > :warning: While we have no reason to think this option is broke, we haven't completely tested it with the SaaS Builder Toolkit (SBT) integration. Please report any issues found [here](https://github.com/aws-samples/aws-saas-factory-eks-reference-architecture/issues).

    > :warning: This option requires an external domain name for which you control DNS settings. If you don't currently own a domain name, you can purchase usually for under $5. namecheap.com is a great resource for this.

    > :warning: If you already have a hosted zone for your domain, just take note of its ID (final step in this block)

    * Open the AWS Console and ensure you're using a region where EKS is supported. Consult [this link](https://aws.amazon.com/about-aws/global-infrastructure/regional-product-services/) for more information.
    * Navigate to the `Route53` service and click the `Hosted Zones` link on the left nav
    * Click the orange `Create Hosted Zone` Button
    * In the Domain Name input, enter your domain name. Ex: example.com. Note, do not include any subdomains (i.e. www. or app.) and click the orange `Create hosted Zone` button
    * In the Hosted Zone details page, take note of the four name servers for your domain in the NS row of the details. They will look something like this:
        ```code
            ns-111.awsdns-11.com.
            ns-222.awsdns-22.net.
            ns-3333.awsdns-33.co.uk.
            ns-444.awsdns-44.org.
        ```

    * Back in your Domain Provider's website, manage the DNS for your domain and update and add all four nameservers (without the trailing period) to your domain's nameserver list
    * Back on the AWS console, click the `Hosted Zones` link in the left nav and take note (or copy to the clipboard) of the ID for the hosted zone you just created. It'll look something like this: Z1234567KVVZTHQRRIIP

    Execute the below commands. Make sure you replace the values for email, domain and hostedzone.

    ```bash
    npm i
    npm run deploy --email=your@email.com --domain=base.domain.com --hostedzone=hosted-zone-id
    ```

    This process will take about 40 - 45 minutes to complete.
    
   **NOTE**: We are currently tracking one open issue where, at times, during the deployment process the SaaSApi stack fails with a message that the Network Load Balancer (NLB) is not in an active state. If you see this issue, the current workaround is to navigate to the Amazon Cloud9 console and run the same npm run deploy command that you used previously to create the stack. It is important to ensure you use the same command that you ran previously with the same parameters, and it could be either with option 1/ without domain, 2/ with domain, or 3/with Kubecost. After you execute the command, the stack creation will continue from where it left off and the SaaSApi stack will complete successfully. Meanwhile, we are working on a solution to address this issue.

1. After the deployment is complete, if you want to inspect the services deployed within the Amazon EKS cluster, you  will need to provide Cloud9 access to the cluster. For this, go to the Cloudformation console, and look for the stack named *EKSSaaSCluster*. Go to the *Outputs* tab and look for the key *SaaSClusterConfigCommand*. Copy the entire value, which should start with "aws eks update-kubeconfig --name EKSSaaS", and then run the command in your Cloud9 terminal. You should see an output that starts with "Updated context.." which means the local Kubeconfig file has the necessary details  to access your EKS clustr

Now, run the below command to access the EKS cluster and the services deployed within the cluster.

    ***kubectl get nodes***

    To access the deployed pods in the default namespace, run the below command

    ***kubectl get pods***
   

8. Finally, the following websites should be provisioned and ready for you to use:

    [https://www.YOURDOMAIN.com](https://www.YOURDOMAIN.com) - This is the "landing page" for your multi-tenant e-Commerce platform. From this page, customers can self-signup for a new account
    [https://admin.YOURDOMAIN.com](https://admin.YOURDOMAIN.com) - This is the "administration" page for your multi-tenant e-Commerce platform. From this page, your tenant administrator can view global statistics for the platform and onboard new tenants. In a normal application, this page would be behind some strict security. We've left this page entirely anonymous for demonstration purposes.

## Cleanup

Since AWS CDK was used to provision all of the required resources in this reference solution, cleaning up is relatively straightforwardf. CD in to the directory `aws-saas-factory-eks-reference-architecture` and then execute the command `cdk destroy --all`. 

Go to Cloud9 terminal and run the below commands:

    ```bash
    cd aws-saas-factory-eks-reference-architecture
    cdk destroy --all
    ```

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.

# GitHub repository

For a complete implementation of the sample architecture for this pattern, see the [GitHub repository](https://github.com/aws-samples/aws-saas-factory-eks-reference-architecture)
