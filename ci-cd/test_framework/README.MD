# Setting up the test framework
1. Add hetzner token to os environment variable:  $Env:<variable-name> = "<new-value>"
2. Create virtual environment and pip install hcloud
3. Change environment variable IS_TEST to true
4. Change compose file so backend looks at IS_TEST env variable
5. Change compose file so backend exposes port 3000
6. Run the script: python scaling_test.py
7. Enjoy