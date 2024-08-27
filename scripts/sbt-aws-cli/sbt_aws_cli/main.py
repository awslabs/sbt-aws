import os
import json
import base64
import time
import requests
import typer
import webbrowser 

app = typer.Typer(help="CLI tool for managing SaaS Builder Toolkit (SBT) for AWS")

# Constants
CONFIG_FILE = os.path.expanduser("~/.sbt-aws-config")

# Helper functions
def get_token(client_id, client_secret, fqdn):
    auth_header = 'Basic ' + base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()
    try:
        response = requests.post(
            f'https://{fqdn}/token?client_id={client_id}',
            headers={'Authorization': auth_header}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as error:
        print('Error getting token:', error.response.json() if error.response else str(error))

def check_status(client_id, client_secret, fqdn, device_code):
    auth_header = 'Basic ' + base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()
    try:
        response = requests.post(
            f'https://{fqdn}/token?client_id={client_id}&device_code={device_code}&grant_type=urn:ietf:params:oauth:grant-type:device_code',
            headers={'Authorization': auth_header}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.HTTPError as error:
        if error.response.status_code == 400:
            return error.response.json()
        else:
            return {'error': f'HTTP Error {error.response.status_code}: {error.response.text}'}
    except requests.exceptions.RequestException as error:
        return {'error': str(error)}

def generate_credentials(client_id, client_secret, fqdn, debug: bool):
    if debug:
        print("Generating credentials...")

    if debug:
        print(f"CLIENT_ID: {client_id}")
        print(f"FQDN: {fqdn}")

    token_data = get_token(client_id, client_secret, fqdn)
    if token_data:
        device_code = token_data.get('device_code')
        verification_uri_complete = token_data.get('verification_uri_complete')
        interval = token_data.get('interval', 5)

        if verification_uri_complete:
            print('You should have been directed to the browser for verification. If not, please go to:', verification_uri_complete)
            webbrowser.open(verification_uri_complete) 
        else:
            print('No verification URL provided by the authorization server.')
            return

        max_attempts = 60  # 5 minutes 
        attempts = 0

        while attempts < max_attempts:
            time.sleep(interval)
            status = check_status(client_id, client_secret, fqdn, device_code)
            
            if 'error' in status:
                if status['error'] == 'authorization_pending':
                    print('Authorization pending, checking again in a few seconds...')
                elif status['error'] == 'slow_down':
                    print('Polling too frequently, slowing down...')
                    interval += 5
                elif status['error'] == 'expired_token':
                    print('Device code expired. Please try again.')
                    return
                elif status['error'].startswith('HTTP Error'):
                    print('Retrying...')
                else:
                    print(f'Unexpected error: {status["error"]}')
                    return
            elif 'access_token' in status:
                print('Authorization successful')
                os.environ['ACCESS_TOKEN'] = status['access_token']
                os.environ['REFRESH_TOKEN'] = status['refresh_token']
                return
            
            attempts += 1

        print('Authorization timed out. Please try again.')

@app.command()
def configure(
    control_plane_stack: str = typer.Argument(..., help="Name of the Control Plane CloudFormation stack"),
    client_id: str = typer.Argument(..., help="Device Cognito Client ID for authentication"),
    fqdn: str = typer.Argument(..., help="Fully Qualified Domain Name for the control plane"),
    control_plane_api_endpoint: str = typer.Argument(..., help="API endpoint for the control plane"),
    cognito_domain: str = typer.Argument(..., help="Cognito domain for authentication"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Configure the SBT CLI with Control Plane stack information and generate credentials.
    """
    client_secret = typer.prompt("Device Cognito Client Secret for authentication", hide_input=True)

    if debug:
        print("Configuring with:")
        print(f"CONTROL_PLANE_STACK_NAME: {control_plane_stack}")
        print(f"CLIENT_ID: {client_id}")
        print(f"CLIENT_SECRET: {client_secret}")
        print(f"FQDN: {fqdn}")
        print(f"CONTROL_PLANE_API_ENDPOINT: {control_plane_api_endpoint}")
        print(f"cognito_domain: {cognito_domain}")
    
    generate_credentials(client_id, client_secret, fqdn, debug)

    config_data = {
        "CONTROL_PLANE_STACK_NAME": control_plane_stack,
        "CONTROL_PLANE_API_ENDPOINT": control_plane_api_endpoint,
        "COGNITO_DOMAIN": cognito_domain,
        "CLIENT_ID": client_id,
        "CLIENT_SECRET": client_secret,
        "FQDN": fqdn,
        "ACCESS_TOKEN": os.getenv('ACCESS_TOKEN'),
        "REFRESH_TOKEN": os.getenv('REFRESH_TOKEN')
    }

    with open(CONFIG_FILE, 'w') as config_file:
        json.dump(config_data, config_file)

    if debug:
        print(f"Configuration saved to {CONFIG_FILE}")

def source_config():
    with open(CONFIG_FILE, 'r') as config_file:
        return json.load(config_file)

@app.command()
def refresh_tokens(debug: bool = typer.Option(False, help="Enable debug mode")):
    """
    Refresh the access and refresh tokens for the current session.
    """
    config = source_config()
    if debug:
        print("Refreshing tokens...")
        
    client_id = config["CLIENT_ID"]
    client_secret = config["CLIENT_SECRET"]
    cognito_domain = config["COGNITO_DOMAIN"]

    auth_header = 'Basic ' + base64.b64encode(f'{client_id}:{client_secret}'.encode()).decode()
    try:
        response = requests.post(
            f'https://{cognito_domain}/token',
            data={
                'grant_type': 'refresh_token',
                'client_id': client_id,
                'refresh_token': config['REFRESH_TOKEN']
            },
            headers={'Authorization': auth_header, 'Content-Type': 'application/x-www-form-urlencoded'}
        )
        response.raise_for_status()
        refreshed_token_data = response.json()

        if refreshed_token_data:
            config["ACCESS_TOKEN"] = refreshed_token_data['access_token']
            with open(CONFIG_FILE, 'w') as config_file:
                json.dump(config, config_file)

        if debug:
            print(f"Tokens refreshed and saved to {CONFIG_FILE}")
            
    except requests.exceptions.RequestException as error:
        print('Error refreshing token:', error.response.json() if error.response else str(error))

@app.command()
def create_tenant(
    tenant_name: str = typer.Argument(..., help="Tenant name"),
    tenant_email: str = typer.Argument(..., help="Tenant email"),
    tenant_tier: str = typer.Argument(..., help="Tenant tier (e.g., basic, advanced, premium"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Create a new tenant with user-provided name, email, and tier.
    """
    config = source_config()
    
    if debug:
        print("Creating tenant with:")
        print(f"TENANT_NAME: {tenant_name}")
        print(f"TENANT_EMAIL: {tenant_email}")
        print(f"TENANT_TIER: {tenant_tier}")

    data = {
        "tenantName": tenant_name,
        "email": tenant_email,
        "tier": tenant_tier,
    }

    response = requests.post(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}tenants",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}", "Content-Type": "application/json"},
        data=json.dumps(data)
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def get_tenant(
    tenant_id: str = typer.Argument(..., help="ID of the tenant to retrieve"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Retrieve information for a specific tenant by ID.
    """
    config = source_config()
    if debug:
        print(f"Getting tenant with ID: {tenant_id}")

    response = requests.get(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}tenants/{tenant_id}",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}"}
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def get_all_tenants(
    limit: int = typer.Argument(10, help="Maximum number of tenants to retrieve"),
    next_token: str = typer.Argument("", help="Token for pagination"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Retrieve a list of all tenants
    """
    config = source_config()
    if debug:
        print("Getting all tenants")
    
    limit = int(limit)

    response = requests.get(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}tenants",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}"},
        params={"limit": limit, "next_token": next_token}
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def delete_tenant(
    tenant_id: str = typer.Argument(..., help="ID of the tenant to delete"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Delete a specific tenant by ID.
    """
    config = source_config()
    if debug:
        print(f"Deleting tenant with ID: {tenant_id}")

    response = requests.delete(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}tenants/{tenant_id}",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}"}
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def create_user(
    user_name: str = typer.Argument(..., help="Name of the user"),
    user_email: str = typer.Argument(..., help="Email of the user"),
    user_role: str = typer.Argument(..., help="Role of the user (e.g basicUser)"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Create a new user.
    """
    config = source_config()

    if debug:
        print("Creating user with:")
        print(f"USER_NAME: {user_name}")
        print(f"USER_EMAIL: {user_email}")
        print(f"USER_ROLE: {user_role}")

    data = {
        "userName": user_name,
        "email": user_email,
        "userRole": user_role
    }

    response = requests.post(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}users",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}", "Content-Type": "application/json"},
        data=json.dumps(data)
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def get_all_users(
    limit: int = typer.Argument(10, help="Maximum number of users to retrieve"),
    next_token: str = typer.Argument("", help="Token for pagination"),
    debug: bool = typer.Option(False, help="Enable debug mode for")
):
    """
    Retrieve a list of all users
    """
    config = source_config()
    if debug:
        print("Getting all users")
    
    params = {"limit": limit}
    if next_token:
        params["next_token"] = next_token

    response = requests.get(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}users",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}"},
        params=params
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def get_user(
    user_id: str = typer.Argument(..., help="ID of the user to retrieve"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Retrieve information for a specific user by ID.
    """
    config = source_config()
    if debug:
        print(f"Getting user with ID: {user_id}")

    response = requests.get(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}users/{user_id}",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}"}
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def update_user(
    user_id: str = typer.Argument(..., help="ID of the user to update"),
    user_role: str = typer.Argument(None, help="New role for the user"),
    user_email: str = typer.Argument(None, help="New email for the user"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Update a user's role and/or email.
    """
    config = source_config()
    data = {k: v for k, v in {"userRole": user_role, "email": user_email}.items() if v is not None}

    if debug:
        print(f"Updating user with ID: {user_id} with DATA: {data}")

    response = requests.put(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}users/{user_id}",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}", "Content-Type": "application/json"},
        data=json.dumps(data)
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def delete_user(
    user_id: str = typer.Argument(..., help="ID of the user to delete"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Delete a specific user by ID.
    """
    config = source_config()
    if debug:
        print(f"Deleting user with ID: {user_id}")

    response = requests.delete(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}users/{user_id}",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}"}
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))

@app.command()
def update_tenant(
    tenant_id: str = typer.Argument(..., help="ID of the tenant to update"),
    key: str = typer.Argument(..., help="Key of the attribute to update"),
    value: str = typer.Argument(..., help="New value for the attribute"),
    debug: bool = typer.Option(False, help="Enable debug mode")
):
    """
    Update a specific attribute of a tenant.
    """
    config = source_config()
    data = {key: value}

    if debug:
        print(f"Updating tenant with ID: {tenant_id} with DATA: {data}")

    response = requests.put(
        f"{config['CONTROL_PLANE_API_ENDPOINT']}tenants/{tenant_id}",
        headers={"Authorization": f"Bearer {config['ACCESS_TOKEN']}", "Content-Type": "application/json"},
        data=json.dumps(data)
    )

    if debug:
        print(f"Response: {response.json()}")
    else:
        print(json.dumps(response.json()))