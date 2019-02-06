#/bin/bash

echo "### Setting api key ###"
echo '' >> app.yaml
echo 'env_variables:' >> app.yaml
echo "  API_KEY: $KEY" >> app.yaml
