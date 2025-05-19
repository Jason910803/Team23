import requests

url = 'http://localhost:9000'

def get_jwt_token(username, password):
  response = requests.post(
    f'{url}/api/token/',
    data={'username': username, 'password': password}
  )
  return response.json()  # 返回 access_token 和 refresh_token

def access_protected_resource(access_token):
  headers = {'Authorization': f'Bearer {access_token}'}
  response = requests.get(
    f'{url}/api/protected/',
    headers=headers
  )
  return response.json()

def refresh_jwt_token(refresh_token):
  response = requests.post(
    f'{url}/api/token/refresh/',
    data={'refresh': refresh_token}
  )
  return response.json()  # 返回新的 access_token

def logout(refresh_token, access_token):
    headers = {
        'Content-Type': 'application/json',
        'Authorization': f'Bearer {access_token}'
    }
    response = requests.post(
        f'{url}/api/logout/',
        json={'refresh': refresh_token},
        headers=headers
    )
    return response.json()

# Example usage
if __name__=="__main__":
    # Login and get tokens
    tokens = get_jwt_token('admin','123456')
    print(tokens)
    
    # Use the access token
    r1 = access_protected_resource(tokens['access'])
    print(r1)

    r2 = refresh_jwt_token(tokens['refresh'])
    print('Refresh:', r2)

    r3 = access_protected_resource(tokens['access'])
    print('original token:', r3)

    r4 = access_protected_resource(r2['access'])
    print('new token:', r4)
    
    # Logout - invalidates the refresh token
    logout_result = logout(tokens['refresh'], tokens['access'])
    print('Logout result:', logout_result)
    
    # Try to refresh token after logout (should fail)
    try:
        r5 = refresh_jwt_token(tokens['refresh'])
        print('Refresh after logout:', r5)
    except Exception as e:
        print('Refresh failed as expected:', e)
